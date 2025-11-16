import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { extractMermaidFromDocstrings } from './pythonDocstringParser';
import { renderMermaidToSvg } from './mermaidRenderer';

interface DiagramInfo {
    code: string;
    svgPath?: string;
    lastModified: number;
}

function isPythonFile(document: vscode.TextDocument): boolean {
    return document.languageId === 'python';
}

export class MermaidOverlayProvider implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];
    private tempDir: string;
    private webviewPanel: vscode.WebviewPanel | undefined;
    private diagrams: Map<string, DiagramInfo> = new Map();

    constructor() {
        this.tempDir = path.join(os.tmpdir(), 'vscode-mermaid-diagrams');
        
        // Ensure temp directory exists
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }

        // Register hover provider for full diagram display
        this.disposables.push(
            vscode.languages.registerHoverProvider('python', {
                provideHover: (document, position) => {
                    return this.provideHover(document, position);
                }
            })
        );

        // Register command to show diagram in full webview
        this.disposables.push(
            vscode.commands.registerCommand('mermaid.showDiagram', (diagramCode: string) => {
                this.showDiagramInWebview(diagramCode);
            })
        );

        // Listen for text changes to update diagrams
        this.disposables.push(
            vscode.workspace.onDidChangeTextDocument((event) => {
                if (event.document.languageId === 'python') {
                    this.updateDiagrams(event.document);
                }
            })
        );

        // Listen for editor changes
        this.disposables.push(
            vscode.window.onDidChangeActiveTextEditor((editor) => {
                if (editor && isPythonFile(editor.document)) {
                    this.updateDiagrams(editor.document);
                }
            })
        );

        // Initialize diagrams for current document
        if (vscode.window.activeTextEditor?.document.languageId === 'python') {
            this.updateDiagrams(vscode.window.activeTextEditor.document);
        }
    }

    private async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
        try {
            // Find if the position is within a mermaid diagram
            const diagrams = extractMermaidFromDocstrings(document);
            
            for (const diagram of diagrams) {
                // Create a range for the entire mermaid block
                const diagramRange = new vscode.Range(
                    new vscode.Position(diagram.startLine, 0),
                    new vscode.Position(diagram.endLine, 0)
                );
                
                if (diagramRange.contains(position)) {
                    // Get or create SVG for this diagram
                    const svgPath = await this.getOrCreateSvg(diagram.code, document.uri.toString());
                    
                    if (svgPath && fs.existsSync(svgPath)) {
                        // Read SVG content and convert to data URI
                        const svgContent = fs.readFileSync(svgPath, 'utf8');
                        const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
                        
                        // Create hover content with full-size image
                        const markdownContent = new vscode.MarkdownString();
                        markdownContent.supportHtml = true;
                        markdownContent.isTrusted = true;
                        
                        // Show full diagram image immediately
                        markdownContent.appendMarkdown(`
![Mermaid Diagram](${dataUri})

**Mermaid Diagram** - Hover to view, click link below for full-screen view

[📋 Open in Full View](command:mermaid.showDiagram?${encodeURIComponent(JSON.stringify(diagram.code))})
                        `);
                        
                        return new vscode.Hover(markdownContent, diagramRange);
                    }
                }
            }
        } catch (error) {
            console.error('Error providing hover:', error);
        }
        
        return undefined;
    }

    private async getOrCreateSvg(diagramCode: string, documentUri: string): Promise<string | undefined> {
        try {
            const cacheKey = `${documentUri}-${Buffer.from(diagramCode).toString('base64').substring(0, 20)}`;
            
            // Check if we already have this diagram cached
            if (this.diagrams.has(cacheKey) && this.diagrams.get(cacheKey)?.svgPath) {
                const existingPath = this.diagrams.get(cacheKey)!.svgPath!;
                if (fs.existsSync(existingPath)) {
                    return existingPath;
                }
            }
            
            // Generate new SVG
            const svgContent = await renderMermaidToSvg(diagramCode, { theme: 'neutral' });
            const svgPath = path.join(this.tempDir, `diagram-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.svg`);
            
            // Write SVG to file
            fs.writeFileSync(svgPath, svgContent, 'utf8');
            
            // Cache the result
            this.diagrams.set(cacheKey, {
                code: diagramCode,
                svgPath: svgPath,
                lastModified: Date.now()
            });
            return svgPath;
        } catch (error) {
            console.error('Error creating SVG:', error);
        }
        
        return undefined;
    }

    private showDiagramInWebview(diagramCode: string): void {
        console.log('[DEBUG] showDiagramInWebview called with code:', diagramCode.substring(0, 100) + '...');
        
        try {
            // Create or reveal webview panel
            if (this.webviewPanel) {
                console.log('[DEBUG] Revealing existing webview panel');
                this.webviewPanel.reveal();
            } else {
                console.log('[DEBUG] Creating new webview panel');
                this.webviewPanel = vscode.window.createWebviewPanel(
                    'mermaidDiagram',
                    'Mermaid Diagram',
                    vscode.ViewColumn.Beside,
                    {
                        enableScripts: true,
                        retainContextWhenHidden: true
                    }
                );

                this.webviewPanel.onDidDispose(() => {
                    console.log('[DEBUG] Webview panel disposed');
                    this.webviewPanel = undefined;
                });
            }

            // Set webview content
            console.log('[DEBUG] Setting webview HTML content');
            this.webviewPanel.webview.html = this.getWebviewContent(diagramCode);
            console.log('[DEBUG] Webview HTML content set successfully');
            
        } catch (error) {
            console.error('[ERROR] Failed to show diagram in webview:', error);
            vscode.window.showErrorMessage(`Failed to show diagram: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private getWebviewContent(diagramCode: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://unpkg.com/mermaid@10/dist/mermaid.min.js"></script>
            <style>
                body { 
                    margin: 20px; 
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                    font-family: var(--vscode-font-family);
                }
                #diagram { 
                    text-align: center; 
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    min-height: 200px;
                }
                .error {
                    color: var(--vscode-errorForeground);
                    background-color: var(--vscode-inputValidation-errorBackground);
                    padding: 10px;
                    border-radius: 4px;
                    border: 1px solid var(--vscode-inputValidation-errorBorder);
                }
                .loading {
                    color: var(--vscode-foreground);
                    font-style: italic;
                }
            </style>
        </head>
        <body>
            <h2>Mermaid Diagram</h2>
            <div id="diagram">
                <div class="loading">Loading diagram...</div>
            </div>
            <script>
                console.log('Webview loaded, initializing Mermaid...');
                
                // Initialize Mermaid with proper configuration
                mermaid.initialize({ 
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'loose',
                    fontFamily: 'var(--vscode-font-family)',
                    logLevel: 'debug'
                });
                
                async function renderDiagram() {
                    try {
                        console.log('Starting diagram render...');
                        const code = ${JSON.stringify(diagramCode)};
                        console.log('Diagram code:', code);
                        
                        // Use the modern async API
                        const { svg } = await mermaid.render('theGraph', code);
                        console.log('Render successful, updating DOM...');
                        
                        document.getElementById('diagram').innerHTML = svg;
                        console.log('DOM updated with SVG');
                        
                    } catch (error) {
                        console.error('Error rendering diagram:', error);
                        document.getElementById('diagram').innerHTML = 
                            '<div class="error">Error rendering diagram: ' + error.message + '</div>';
                    }
                }
                
                // Start rendering when page loads
                document.addEventListener('DOMContentLoaded', renderDiagram);
                // Also try immediately in case DOMContentLoaded already fired
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', renderDiagram);
                } else {
                    renderDiagram();
                }
            </script>
        </body>
        </html>
        `;
    }

    public async updateDiagrams(document: vscode.TextDocument): Promise<void> {
        try {
            const diagrams = extractMermaidFromDocstrings(document);
            
            // Pre-generate SVGs for all diagrams in the document
            for (const diagram of diagrams) {
                await this.getOrCreateSvg(diagram.code, document.uri.toString());
            }
            
        } catch (error) {
            console.error('Error updating diagrams:', error);
        }
    }

    private getDiagramKey(code: string, documentUri: string): string {
        return `${documentUri}-${Buffer.from(code).toString('base64').substring(0, 20)}`;
    }

    public async refreshDiagrams(): Promise<void> {
        // Clear cache
        this.diagrams.clear();
        
        // Update current document
        if (vscode.window.activeTextEditor?.document.languageId === 'python') {
            await this.updateDiagrams(vscode.window.activeTextEditor.document);
        }
    }

    /**
     * Test method to show a diagram in webview - useful for debugging
     */
    public testShowDiagram(diagramCode: string): void {
        console.log('[DEBUG] testShowDiagram called');
        this.showDiagramInWebview(diagramCode);
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
        }
    }
}
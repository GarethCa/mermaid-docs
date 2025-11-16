import * as vscode from 'vscode';
import * as path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { renderMermaidToSvg } from './mermaidRenderer';
import { MermaidBlock } from './pythonDocstringParser';

export class MermaidDecorationProvider {
    private decorationType: vscode.TextEditorDecorationType;
    private context: vscode.ExtensionContext;
    private imageCache = new Map<string, string>();

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: '',
                margin: '0 0 10px 0'
            },
            isWholeLine: false
        });
    }

    /**
     * Apply Mermaid diagram decorations to the active editor.
     */
    async applyDecorations(editor: vscode.TextEditor, mermaidBlocks: MermaidBlock[]) {
        console.log(`[DEBUG] applyDecorations called with ${mermaidBlocks.length} blocks`);
        const decorations: vscode.DecorationOptions[] = [];

        for (const block of mermaidBlocks) {
            console.log(`[DEBUG] Processing block: lines ${block.startLine}-${block.endLine}, docstring ends at ${block.docstringEnd}`);
            try {
                console.log(`[DEBUG] Rendering block to image...`);
                const imageUri = await this.renderBlockToImage(block);
                
                if (imageUri) {
                    console.log(`[DEBUG] Image rendered successfully: ${imageUri.fsPath}`);
                    const decoration: vscode.DecorationOptions = {
                        range: new vscode.Range(
                            new vscode.Position(block.docstringEnd, 0),
                            new vscode.Position(block.docstringEnd, 0)
                        ),
                        renderOptions: {
                            after: {
                                contentIconPath: imageUri,
                                height: 'auto',
                                width: 'auto',
                                margin: '10px 0'
                            }
                        }
                    };
                    
                    decorations.push(decoration);
                    console.log(`[DEBUG] Added decoration for line ${block.docstringEnd}`);
                } else {
                    console.log(`[DEBUG] Image rendering returned null`);
                }
            } catch (error) {
                console.error(`[ERROR] Failed to render Mermaid diagram:`, error);
                
                // Show more helpful error decoration
                const errorMessage = error instanceof Error ? 
                    error.message : 
                    'Unknown rendering error';
                
                const errorDecoration: vscode.DecorationOptions = {
                    range: new vscode.Range(
                        new vscode.Position(block.docstringEnd, 0),
                        new vscode.Position(block.docstringEnd, 0)
                    ),
                    renderOptions: {
                        after: {
                            contentText: ` ⚠️ Mermaid render failed: ${errorMessage}`,
                            color: new vscode.ThemeColor('errorForeground'),
                            fontStyle: 'italic'
                        }
                    }
                };
                
                decorations.push(errorDecoration);
            }
        }

        console.log(`[DEBUG] Setting ${decorations.length} decorations on editor`);
        editor.setDecorations(this.decorationType, decorations);
        console.log(`[DEBUG] Decorations set successfully`);
    }

    /**
     * Render a Mermaid block to an image and return the file URI.
     */
    private async renderBlockToImage(block: MermaidBlock): Promise<vscode.Uri | null> {
        // Create a cache key based on the mermaid code
        const cacheKey = this.hashCode(block.code);
        
        if (this.imageCache.has(cacheKey)) {
            return vscode.Uri.file(this.imageCache.get(cacheKey)!);
        }

        try {
            // Create images directory in extension storage
            const storageDir = this.context.globalStorageUri.fsPath;
            const imagesDir = path.join(storageDir, 'mermaid-images');
            await mkdir(imagesDir, { recursive: true });

            // Generate unique filename
            const filename = `mermaid-${cacheKey}.svg`;
            const filePath = path.join(imagesDir, filename);

            // Render the Mermaid diagram
            const svg = await renderMermaidToSvg(block.code, { theme: 'default' });
            await writeFile(filePath, svg, 'utf8');

            // Cache the result
            this.imageCache.set(cacheKey, filePath);

            return vscode.Uri.file(filePath);
        } catch (error) {
            console.error('Failed to render Mermaid diagram:', error);
            return null;
        }
    }

    /**
     * Clear all decorations from the editor.
     */
    clearDecorations(editor: vscode.TextEditor) {
        editor.setDecorations(this.decorationType, []);
    }

    /**
     * Dispose of the decoration provider.
     */
    dispose() {
        this.decorationType.dispose();
        this.imageCache.clear();
    }

    /**
     * Simple hash function for cache keys.
     */
    private hashCode(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Clear the image cache.
     */
    clearCache() {
        this.imageCache.clear();
    }
}
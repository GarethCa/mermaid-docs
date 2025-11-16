import * as vscode from 'vscode';
import { MermaidDecorationProvider } from './mermaidDecorationProvider';
import { MermaidOverlayProvider } from './mermaidOverlayProvider';
import { extractMermaidFromDocstrings, isPythonFile } from './pythonDocstringParser';

let decorationProvider: MermaidDecorationProvider | undefined;
let overlayProvider: MermaidOverlayProvider | undefined;
let isRenderingEnabled = true;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Mermaid VSCode Extension is now active!');

	// Initialize the decoration provider for inline diagrams
	decorationProvider = new MermaidDecorationProvider(context);
	
	// Initialize the overlay provider for hover functionality
	overlayProvider = new MermaidOverlayProvider();

	// Register commands
	const toggleCommand = vscode.commands.registerCommand('mermaid.toggleDiagrams', () => {
		isRenderingEnabled = !isRenderingEnabled;
		const status = isRenderingEnabled ? 'enabled' : 'disabled';
		vscode.window.showInformationMessage(`Mermaid diagram rendering ${status}`);
		console.log(`[DEBUG] Toggled rendering: ${status}`);
		
		if (isRenderingEnabled) {
			updateActiveEditor();
		} else {
			clearAllDecorations();
		}
	});

	const refreshCommand = vscode.commands.registerCommand('mermaid.refreshDiagrams', () => {
		decorationProvider?.clearCache();
		overlayProvider?.refreshDiagrams();
		console.log(`[DEBUG] Refreshing diagrams...`);
		updateActiveEditor();
		vscode.window.showInformationMessage('Mermaid diagrams refreshed');
	});

	// Add a test command to create a simple decoration
	const testCommand = vscode.commands.registerCommand('mermaid.testDecoration', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && decorationProvider) {
			console.log(`[DEBUG] Creating test decoration...`);
			
			// Create a simple text decoration
			const testDecorationType = vscode.window.createTextEditorDecorationType({
				after: {
					contentText: ' 🎯 TEST DECORATION',
					color: 'green',
					fontStyle: 'italic'
				}
			});
			
			const decoration = {
				range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0))
			};
			
			editor.setDecorations(testDecorationType, [decoration]);
			vscode.window.showInformationMessage('Test decoration added to first line');
		}
	});

	const helloCommand = vscode.commands.registerCommand('mermaid.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Mermaid VSCode Extension!');
	});

	// Add test command for webview functionality
	const testWebviewCommand = vscode.commands.registerCommand('mermaid.testWebview', () => {
		const testDiagramCode = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`;
		
		console.log('[DEBUG] Testing webview with sample diagram');
		overlayProvider?.testShowDiagram(testDiagramCode);
	});

	// Register event listeners
	const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor && isRenderingEnabled) {
			updateActiveEditor();
		}
	});

	const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && 
			activeEditor.document === event.document && 
			isPythonFile(event.document) && 
			isRenderingEnabled) {
			// Debounce updates to avoid excessive rendering during typing
			debounce(() => updateActiveEditor(), 1000)();
		}
	});

	// Initial update for current editor
	if (vscode.window.activeTextEditor && isRenderingEnabled) {
		updateActiveEditor();
	}

	// Add all disposables to context
	context.subscriptions.push(
		toggleCommand,
		refreshCommand,
		testCommand,
		testWebviewCommand,
		helloCommand,
		onDidChangeActiveTextEditor,
		onDidChangeTextDocument,
		decorationProvider,
		overlayProvider
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Mermaid VSCode Extension is now deactivated!');
	decorationProvider?.dispose();
	overlayProvider?.dispose();
}

/**
 * Update decorations for the currently active editor.
 */
async function updateActiveEditor() {
	const editor = vscode.window.activeTextEditor;
	
	console.log(`[DEBUG] updateActiveEditor called`);
	console.log(`[DEBUG] Active editor exists: ${!!editor}`);
	
	if (!editor) {
		console.log(`[DEBUG] No active editor, returning`);
		return;
	}
	
	console.log(`[DEBUG] Document filename: ${editor.document.fileName}`);
	console.log(`[DEBUG] Document language: ${editor.document.languageId}`);
	console.log(`[DEBUG] isPythonFile: ${isPythonFile(editor.document)}`);
	console.log(`[DEBUG] decorationProvider exists: ${!!decorationProvider}`);
	console.log(`[DEBUG] isRenderingEnabled: ${isRenderingEnabled}`);

	if (!isPythonFile(editor.document) || !decorationProvider || !isRenderingEnabled) {
		console.log(`[DEBUG] Conditions not met for rendering`);
		return;
	}

	try {
		console.log(`[DEBUG] Starting to extract Mermaid blocks...`);
		// Extract Mermaid blocks from the document
		const mermaidBlocks = extractMermaidFromDocstrings(editor.document);
		
		console.log(`[DEBUG] Found ${mermaidBlocks.length} Mermaid diagram(s) in ${editor.document.fileName}`);
		
		if (mermaidBlocks.length > 0) {
			console.log(`[DEBUG] Mermaid blocks details:`, mermaidBlocks.map(block => ({
				startLine: block.startLine,
				endLine: block.endLine,
				docstringStart: block.docstringStart,
				docstringEnd: block.docstringEnd,
				codePreview: block.code.substring(0, 50) + '...'
			})));
			
			console.log(`[DEBUG] Applying decorations...`);
			await decorationProvider.applyDecorations(editor, mermaidBlocks);
			console.log(`[DEBUG] Decorations applied successfully`);
		} else {
			console.log(`[DEBUG] No Mermaid blocks found, clearing decorations`);
			decorationProvider.clearDecorations(editor);
		}
	} catch (error) {
		console.error('[ERROR] Error updating Mermaid decorations:', error);
		vscode.window.showErrorMessage('Failed to render Mermaid diagrams. Check the console for details.');
	}
}

/**
 * Clear decorations from all visible editors.
 */
function clearAllDecorations() {
	if (!decorationProvider) {
		return;
	}

	vscode.window.visibleTextEditors.forEach(editor => {
		if (isPythonFile(editor.document)) {
			decorationProvider!.clearDecorations(editor);
		}
	});
}

/**
 * Simple debounce function to limit frequent calls.
 */
function debounce(func: Function, wait: number) {
	let timeout: NodeJS.Timeout;
	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

import * as vscode from 'vscode';

export interface MermaidBlock {
    code: string;
    startLine: number;
    endLine: number;
    docstringStart: number;
    docstringEnd: number;
}

/**
 * Extract Mermaid diagram blocks from Python docstrings in a text document.
 */
export function extractMermaidFromDocstrings(document: vscode.TextDocument): MermaidBlock[] {
    console.log(`[DEBUG] extractMermaidFromDocstrings called for: ${document.fileName}`);
    const text = document.getText();
    const lines = text.split('\n');
    console.log(`[DEBUG] Document has ${lines.length} lines`);
    const mermaidBlocks: MermaidBlock[] = [];
    
    // Regex patterns for different docstring formats
    const docstringPatterns = [
        /^\s*(def|class)\s+[^:]+:\s*$/,  // Function or class definition
        /^\s*""".*$/,                    // Triple quoted string start
        /^\s*'''.*$/,                    // Single quoted string start
    ];
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        
        // Look for function/class definitions
        if (/^\s*(def|class)\s+[^:]+:\s*$/.test(line)) {
            console.log(`[DEBUG] Found function/class definition at line ${i}: ${line.trim()}`);
            const docstringInfo = findDocstring(lines, i + 1);
            if (docstringInfo) {
                console.log(`[DEBUG] Found docstring at lines ${docstringInfo.start}-${docstringInfo.end}`);
                const mermaidInDocstring = extractMermaidFromDocstring(
                    lines, 
                    docstringInfo.start, 
                    docstringInfo.end
                );
                
                console.log(`[DEBUG] Found ${mermaidInDocstring.length} mermaid blocks in this docstring`);
                
                // Add docstring context to each mermaid block
                mermaidInDocstring.forEach(block => {
                    block.docstringStart = docstringInfo.start;
                    block.docstringEnd = docstringInfo.end;
                    mermaidBlocks.push(block);
                    console.log(`[DEBUG] Added mermaid block: lines ${block.startLine}-${block.endLine}, code preview: ${block.code.substring(0, 30)}...`);
                });
                
                i = docstringInfo.end + 1;
            } else {
                console.log(`[DEBUG] No docstring found after function/class definition`);
                i++;
            }
        } else {
            i++;
        }
    }
    
    console.log(`[DEBUG] Total mermaid blocks found: ${mermaidBlocks.length}`);
    return mermaidBlocks;
}

/**
 * Find the docstring following a function/class definition.
 */
function findDocstring(lines: string[], startLine: number): { start: number; end: number } | null {
    console.log(`[DEBUG] Looking for docstring starting at line ${startLine}`);
    // Skip empty lines and comments
    let i = startLine;
    while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('#'))) {
        console.log(`[DEBUG] Skipping line ${i}: ${lines[i].trim()}`);
        i++;
    }
    
    if (i >= lines.length) {
        console.log(`[DEBUG] Reached end of file, no docstring found`);
        return null;
    }
    
    const line = lines[i].trim();
    console.log(`[DEBUG] Checking line ${i} for docstring: ${line}`);
    
    // Check for triple-quoted docstring
    if (line.startsWith('"""') || line.startsWith("'''")) {
        const quote = line.startsWith('"""') ? '"""' : "'''";
        console.log(`[DEBUG] Found docstring start with ${quote} at line ${i}`);
        
        // Single line docstring
        if (line.length > 3 && line.endsWith(quote) && line !== quote) {
            console.log(`[DEBUG] Single-line docstring found`);
            return { start: i, end: i };
        }
        
        // Multi-line docstring
        for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes(quote)) {
                console.log(`[DEBUG] Multi-line docstring end found at line ${j}`);
                return { start: i, end: j };
            }
        }
        console.log(`[DEBUG] Multi-line docstring not properly closed`);
    }
    
    console.log(`[DEBUG] No docstring found`);
    return null;
}

/**
 * Extract Mermaid diagram blocks from within a docstring.
 */
function extractMermaidFromDocstring(lines: string[], startLine: number, endLine: number): MermaidBlock[] {
    const blocks: MermaidBlock[] = [];
    let i = startLine;
    
    while (i <= endLine) {
        const line = lines[i];
        
        // Look for mermaid code blocks
        if (line.includes('```mermaid') || line.includes('```') && lines[i + 1]?.trim().startsWith('graph')) {
            const mermaidStart = i + 1;
            let mermaidEnd = -1;
            
            // Find the end of the code block
            for (let j = mermaidStart; j <= endLine; j++) {
                if (lines[j].includes('```')) {
                    mermaidEnd = j - 1;
                    break;
                }
            }
            
            if (mermaidEnd > mermaidStart) {
                // Extract the mermaid code
                const mermaidLines = lines.slice(mermaidStart, mermaidEnd + 1);
                const code = mermaidLines
                    .map(l => l.trim())
                    .filter(l => l.length > 0)
                    .join('\n');
                
                if (code.trim()) {
                    blocks.push({
                        code,
                        startLine: mermaidStart,
                        endLine: mermaidEnd,
                        docstringStart: startLine,
                        docstringEnd: endLine
                    });
                }
                
                i = mermaidEnd + 2; // Skip past the closing ```
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
    
    return blocks;
}

/**
 * Check if a document is a Python file.
 */
export function isPythonFile(document: vscode.TextDocument): boolean {
    return document.languageId === 'python' || document.fileName.endsWith('.py');
}
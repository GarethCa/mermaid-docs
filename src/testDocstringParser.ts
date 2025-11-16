import * as vscode from 'vscode';
import { extractMermaidFromDocstrings, isPythonFile } from './pythonDocstringParser';

async function testDocstringParser() {
    console.log('Testing Mermaid docstring extraction...');
    
    // Create a mock document with our sample content
    const samplePythonCode = `def process_workflow():
    """
    Process a typical workflow with decision points.
    
    \`\`\`mermaid
    graph TD
        A[Start] --> B{Check}
        B -->|Valid| C[Process]
        style C fill:#9f6
    \`\`\`
    
    Returns result.
    """
    return "done"

class TestClass:
    """
    Test class with diagram.
    
    \`\`\`mermaid
    graph LR
        A --> B --> C
    \`\`\`
    """
    pass`;

    // Create a test URI and document
    const testUri = vscode.Uri.parse('test://test.py');
    const mockDocument = {
        getText: () => samplePythonCode,
        languageId: 'python',
        fileName: 'test.py'
    } as vscode.TextDocument;
    
    // Test the extraction
    const mermaidBlocks = extractMermaidFromDocstrings(mockDocument);
    
    console.log(`Found ${mermaidBlocks.length} Mermaid blocks:`);
    mermaidBlocks.forEach((block, index) => {
        console.log(`Block ${index + 1}:`);
        console.log(`  Lines: ${block.startLine}-${block.endLine}`);
        console.log(`  Docstring: ${block.docstringStart}-${block.docstringEnd}`);
        console.log(`  Code: ${block.code.substring(0, 50)}...`);
    });
    
    return mermaidBlocks.length;
}

// Run the test if this file is executed directly
if (require.main === module) {
    testDocstringParser()
        .then(count => console.log(`✅ Test completed - found ${count} blocks`))
        .catch(err => console.error('❌ Test failed:', err));
}
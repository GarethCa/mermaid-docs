import { extractMermaidFromDocstrings, isPythonFile } from './pythonDocstringParser';

// Mock VSCode TextDocument
function createMockDocument(content: string, languageId: string = 'python'): any {
    return {
        getText: () => content,
        languageId: languageId,
        fileName: 'test.py'
    };
}

function testParser() {
    const sampleCode = `def process_workflow():
    """
    Process a typical workflow with decision points.

    This function demonstrates a workflow process that can be visualized
    using a Mermaid diagram:

    \`\`\`mermaid
    graph TD
        A[Start Process] --> B{Check Input}
        B -->|Valid| C[Process Data]
        B -->|Invalid| D[Show Error]
        C --> E[Generate Report]
        D --> F[Log Error]
        E --> G[End]
        F --> G
        style C fill:#9f6
        style D fill:#f96
    \`\`\`

    Returns:
        str: The result of the workflow processing
    """
    return "Workflow completed successfully"`;

    const mockDoc = createMockDocument(sampleCode);
    
    console.log('Testing with sample code:');
    console.log('='.repeat(50));
    console.log(sampleCode);
    console.log('='.repeat(50));
    
    const blocks = extractMermaidFromDocstrings(mockDoc);
    
    console.log(`\nResult: Found ${blocks.length} Mermaid blocks`);
    blocks.forEach((block, index) => {
        console.log(`Block ${index + 1}:`);
        console.log(`  Start line: ${block.startLine}`);
        console.log(`  End line: ${block.endLine}`);
        console.log(`  Docstring start: ${block.docstringStart}`);
        console.log(`  Docstring end: ${block.docstringEnd}`);
        console.log(`  Code preview: ${block.code.substring(0, 100)}...`);
    });
}

if (require.main === module) {
    testParser();
}
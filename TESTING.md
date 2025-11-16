# Testing the Mermaid VSCode Extension

## Quick Start

1. **Open this project in VSCode**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the extension:**
   ```bash
   npm run compile
   ```

4. **Launch Extension Development Host:**
   - Press `F5` in VSCode
   - This opens a new VSCode window with your extension loaded

5. **Open the sample Python file:**
   - In the Extension Development Host window, open `sample_python_file.py`
   - You should see Mermaid diagrams rendered below the docstrings

## What You Should See

The extension will automatically:
- Detect Python files
- Find Mermaid diagrams in docstrings (marked with ````mermaid` blocks)
- Render SVG diagrams below each docstring (inline view)
- Show hover previews when you hover over Mermaid code blocks
- Allow clicking hover previews to open full-size diagrams in side panels
- Add toolbar buttons (👁️ toggle, 🔄 refresh) for Python files

## Testing Commands

- **Toggle Diagrams**: Click the eye icon (👁️) in the toolbar or use Command Palette > "Toggle Mermaid Diagrams"
- **Refresh Diagrams**: Click the refresh icon (🔄) in the toolbar or use Command Palette > "Refresh Mermaid Diagrams"
- **Test Hover**: Hover over any Mermaid code block to see preview
- **Test Full View**: Click on a hover preview to open the diagram in a side panel

## Expected Behavior

✅ **Working correctly if you see:**
- SVG diagrams appear below Python docstrings (inline view)
- Hover previews appear when hovering over Mermaid code blocks
- Clicking hover previews opens diagrams in side panels
- Diagrams update when you edit the Mermaid code
- Toggle button hides/shows diagrams
- Refresh button re-renders diagrams
- Console logs show "Found mmdc at:" and successful execution

❌ **Troubleshooting:**

### Common Issues & Fixes

1. **"mmdc executable not found" errors**:
   - ✅ **FIXED**: Extension now uses direct path to locally installed mmdc
   - Extension will show path resolution in console logs
   - If still failing, run `npm install` to ensure dependencies are installed

2. **"Command failed: npx mmdc" errors**:
   - ✅ **FIXED**: No longer uses `npx`, uses direct Node.js execution
   - Extension now includes better error handling and diagnostic logging

3. **Empty or no diagrams appearing**:
   - Check Developer Console (`Help > Toggle Developer Tools`) for detailed logs
   - Verify Mermaid syntax is correct in the Python docstrings
   - Look for "Found mmdc at:" and "Executing:" log messages
   - Try refreshing diagrams manually with the toolbar button

4. **Extension not activating**:
   - Ensure you're opening a `.py` file
   - Check that the extension shows "Mermaid VSCode Extension is now active!" in console
   - Verify the extension loaded in Extensions panel

## Detailed Console Logs

When working correctly, you should see logs like:
```
Mermaid VSCode Extension is now active!
Found 4 Mermaid diagram(s) in [file path]
Found mmdc at: [path to mmdc]
Executing: node "[mmdc path]" -i "[temp input]" -o "[temp output]" -t "default" -b white
Working directory: [extension directory]  
mmdc stdout: Generating single mermaid chart
```

## Sample Diagrams in `sample_python_file.py`

The sample file contains:
1. **Workflow diagram** - Shows process flow with decision points
2. **Data pipeline diagram** - Linear process flow
3. **Analysis flowchart** - Complex decision tree with loops
4. **Network topology** - System architecture diagram

## Development Notes

- Extension activates when a Python file is opened
- Diagrams are cached for performance (stored in VSCode global storage)
- Uses mermaid-cli for reliable rendering (no browser required)
- Images are stored as SVG files in temp directories
- Path resolution tries multiple locations to find mmdc executable

## Diagnostic Commands

Test the renderer independently:
```bash
npm run test-mermaid
```

This will:
- Render sample diagrams to `test-output/`
- Show path resolution and execution logs
- Verify mmdc is working correctly

## File Structure

```
src/
├── extension.ts                 # Main extension entry point
├── pythonDocstringParser.ts     # Extracts Mermaid from docstrings  
├── mermaidDecorationProvider.ts # Renders diagrams in VSCode
├── mermaidRenderer.ts          # Converts Mermaid to SVG/PNG (FIXED)
├── testMermaidRenderer.ts      # Tests rendering functionality
└── testDocstringParser.ts      # Tests docstring parsing

sample_python_file.py           # Example Python file with diagrams
```

## Recent Fixes Applied

✅ **Fixed mmdc path resolution**: Extension now finds the locally installed mmdc binary correctly  
✅ **Added better error handling**: More descriptive error messages in decorations  
✅ **Improved diagnostic logging**: Console shows path resolution and execution details  
✅ **Removed npx dependency**: Uses direct Node.js execution for better reliability  

Happy testing! 🚀
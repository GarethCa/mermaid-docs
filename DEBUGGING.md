# Debugging Guide - Mermaid Extension Not Showing Diagrams

## Current Issue
Extension loads successfully but diagrams are not being displayed in the editor.

## Debugging Steps

### 1. Launch Extension with Enhanced Logging

1. **Open this project in VSCode**
2. **Press F5** to launch Extension Development Host
3. **Open Developer Console immediately**: `Help > Toggle Developer Tools`
4. **Keep console open** to see all debug messages

### 2. Test Basic Extension Functionality

In the Extension Development Host:

1. **Open `sample_python_file.py`**
2. **Check console for messages starting with `[DEBUG]`**
3. **Run Command**: `Ctrl+Shift+P` → "Test Decoration"
   - This should add a green "🎯 TEST DECORATION" to line 1
   - If this works, VSCode decorations are functional

### 3. Check Parser Functionality  

Look for these specific debug messages in console:
```
[DEBUG] updateActiveEditor called
[DEBUG] Active editor exists: true
[DEBUG] Document filename: [path to sample_python_file.py]
[DEBUG] Document language: python
[DEBUG] isPythonFile: true
[DEBUG] decorationProvider exists: true
[DEBUG] isRenderingEnabled: true
[DEBUG] Starting to extract Mermaid blocks...
[DEBUG] extractMermaidFromDocstrings called for: [filename]
[DEBUG] Document has [X] lines
[DEBUG] Found function/class definition at line [X]: def process_workflow():
[DEBUG] Looking for docstring starting at line [X]
[DEBUG] Found docstring start with """ at line [X]
[DEBUG] Multi-line docstring end found at line [X]
[DEBUG] Found docstring at lines [X-Y]
[DEBUG] Found [N] mermaid blocks in this docstring
[DEBUG] Total mermaid blocks found: [N]
```

**Expected**: Should find 4 Mermaid blocks in `sample_python_file.py`

### 4. Check Decoration Application

Look for these messages:
```
[DEBUG] applyDecorations called with [N] blocks
[DEBUG] Processing block: lines [X-Y], docstring ends at [Z]
[DEBUG] Rendering block to image...
[DEBUG] Found mmdc at: [path]
[DEBUG] Executing: node "[path]" -i "[temp]" -o "[temp]" -t "default" -b white
[DEBUG] Working directory: [path]
[DEBUG] Image rendered successfully: [path]
[DEBUG] Added decoration for line [X]
[DEBUG] Setting [N] decorations on editor
[DEBUG] Decorations set successfully
```

### 5. Manual Commands for Testing

Run these commands via Command Palette (`Ctrl+Shift+P`):

1. **"Hello World"** - Basic extension test
2. **"Test Decoration"** - Test if decorations work at all
3. **"Toggle Mermaid Diagrams"** - Enable/disable (should be enabled by default)
4. **"Refresh Mermaid Diagrams"** - Force re-render

### 6. Common Issues & Solutions

#### Issue: No debug messages appear
**Solution**: 
- Extension didn't activate
- Check if you're opening a `.py` file
- Try opening `sample_python_file.py` specifically

#### Issue: Parser debug messages appear but no decoration messages
**Solution**: 
- Problem is in the decoration provider
- Check if `applyDecorations called` appears
- If not, there's an issue between parser and decorator

#### Issue: Decoration messages appear but no images shown
**Solutions**:
- Check if image files are being created in temp directories
- Check if mmdc path resolution is working
- Check if VSCode can access the generated image files

#### Issue: "Test Decoration" command doesn't work
**Solution**: 
- Basic VSCode decorations are broken
- Try restarting the Extension Development Host
- Check VSCode version compatibility

### 7. File System Checks

If images are being generated but not displayed:

1. **Check temp directory**: Look for files like `/tmp/mermaid-*.svg`
2. **Check VSCode storage**: `~/.vscode/extensions/[temp]/globalStorage/[extension]/mermaid-images/`
3. **Check file permissions**: Make sure VSCode can read generated files

### 8. Test with Minimal Example

Create a simple test file:
```python
def test():
    """
    Test function.
    
    \`\`\`mermaid
    graph TD
        A --> B
    \`\`\`
    """
    pass
```

This should definitely work if the extension is functioning.

### 9. Expected Working Behavior

When working correctly, you should see:
1. ✅ Console shows all debug messages
2. ✅ Parser finds Mermaid blocks
3. ✅ Images are generated successfully  
4. ✅ Decorations are applied
5. ✅ SVG diagrams appear below docstrings in the editor

### 10. Next Steps

Based on where the debug messages stop, we can identify:
- **No parser messages**: Issue with extension activation or file detection
- **Parser works, no decoration messages**: Issue with decoration provider
- **Decoration messages, no images**: Issue with image rendering or file paths
- **Images rendered, not displayed**: Issue with VSCode decoration display

## Debug Output Template

Please share the console output focusing on messages that start with:
- `[DEBUG]`
- `[ERROR]` 
- `Mermaid VSCode Extension`
- `Found mmdc at`
- `Executing:`

This will help identify exactly where the process is failing.
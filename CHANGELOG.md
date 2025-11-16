# Change Log

## [1.0.0] - 2024-11-15

### ✨ Initial Release Features
- 🔍 **Automatic Detection**: Scans Python files for Mermaid diagrams in function and class docstrings
- 🎨 **Inline Rendering**: Displays rendered SVG diagrams directly below docstrings in the editor
- 🖱️ **Hover Previews**: Shows diagram previews when hovering over Mermaid code blocks  
- 🖼️ **Full-size View**: Click hover previews to open diagrams in a dedicated webview panel
- ⚡ **Fast Rendering**: Uses mermaid-cli for quick, reliable diagram generation
- 🎛️ **Toggle Control**: Easy on/off toggle for diagram rendering
- 🔄 **Auto-refresh**: Updates diagrams when you edit the code
- 🧹 **Smart Caching**: Caches rendered diagrams for better performance

### 🛠️ Technical Highlights
- **Zero Dependencies**: No additional setup required - works out of the box
- **Performance Optimized**: Smart caching and efficient rendering pipeline
- **Error Handling**: Graceful error messages with detailed debugging information
- **Cross-platform**: Works on Windows, macOS, and Linux

### 📋 Commands Added
- `mermaid.toggleDiagrams` - Enable/disable diagram rendering
- `mermaid.refreshDiagrams` - Clear cache and re-render all diagrams
- `mermaid.showDiagram` - Open diagram in full-size webview

### 🎯 Supported Features
- All standard Mermaid diagram types (flowcharts, sequence diagrams, etc.)
- Custom styling and theming
- Multi-line docstrings with multiple diagrams
- Function and class docstring support
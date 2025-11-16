# Mermaid Docstring Diagrams

[![Version](https://img.shields.io/vscode-marketplace/v/YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams)
[![Installs](https://img.shields.io/vscode-marketplace/i/YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams)
[![Rating](https://img.shields.io/vscode-marketplace/r/YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams)

A powerful VSCode extension that automatically extracts and renders **Mermaid diagrams from Python docstrings** with inline preview and interactive features.

![Extension Demo](https://via.placeholder.com/800x400/1e1e1e/ffffff?text=Extension+Demo+Screenshot)

## ✨ Features

- 🔍 **Automatic Detection**: Scans Python files for Mermaid diagrams in function and class docstrings
- 🎨 **Inline Rendering**: Displays rendered SVG diagrams directly below docstrings in the editor
- 🖱️ **Hover Previews**: Shows diagram previews when hovering over Mermaid code blocks
- 🖼️ **Full-size View**: Click hover previews to open diagrams in a dedicated webview panel
- ⚡ **Fast Rendering**: Uses mermaid-cli for quick, reliable diagram generation
- 🎛️ **Toggle Control**: Easy on/off toggle for diagram rendering
- 🔄 **Auto-refresh**: Updates diagrams when you edit the code
- 🧹 **Smart Caching**: Caches rendered diagrams for better performance

## 🚀 Quick Start

1. **Install the extension** from the VS Code Marketplace
2. **Open a Python file** with Mermaid diagrams in docstrings
3. **See diagrams render automatically** below the docstrings
4. **Hover over Mermaid code** for quick previews
5. **Click hover previews** to open full-size diagrams

![Quick Start Demo](https://via.placeholder.com/600x300/2196F3/ffffff?text=Quick+Start+Demo)

## 📝 Usage

### Supported Docstring Format

Add Mermaid diagrams to your Python docstrings using triple backtick code blocks:

```python
def process_workflow():
    \"\"\"
    Process a typical workflow with decision points.
    
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
    \"\"\"
    return "Workflow completed successfully"
```

### Supported Diagram Types

This extension supports all Mermaid diagram types:

- 📊 **Flowcharts** - Process flows and decision trees
- 🔄 **Sequence Diagrams** - Interaction workflows
- 📈 **Gantt Charts** - Project timelines
- 🌐 **Network Diagrams** - System architectures
- 📋 **Entity Relationship** - Database schemas
- 🧭 **User Journey** - UX flows
- And many more!

## 🎮 Commands

Access these commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description | Shortcut |
|---------|-------------|----------|
| **Toggle Mermaid Diagrams** | Enable/disable diagram rendering | Click 👁️ icon |
| **Refresh Mermaid Diagrams** | Clear cache and re-render all diagrams | Click 🔄 icon |
| **Show Mermaid Diagram** | Open diagram in full-size webview | Click hover preview |

## ⚙️ Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Mermaid Docstring Diagrams"
4. Click **Install**

### From Command Line
```bash
code --install-extension YOUR_PUBLISHER_NAME.mermaid-docstring-diagrams
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm
- VS Code

### Setup
```bash
git clone https://github.com/YOUR_USERNAME/mermaid-vscode-extension.git
cd mermaid-vscode-extension
npm install
```

### Build & Test
```bash
# Compile the extension
npm run compile

# Test the extension
# Press F5 in VS Code to open Extension Development Host
# Open sample_python_file.py to see diagrams
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Diagrams not appearing** | Check file is `.py`, verify Mermaid syntax, try refresh button |
| **Slow rendering** | Complex diagrams take longer, clear cache and retry |
| **Error decorations** | Check console logs, verify valid Mermaid syntax |
| **Extension not activating** | Ensure you're opening a Python file |

### Getting Help

- 📖 [Documentation](https://github.com/YOUR_USERNAME/mermaid-vscode-extension#readme)
- 🐛 [Report Issues](https://github.com/YOUR_USERNAME/mermaid-vscode-extension/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/mermaid-vscode-extension/discussions)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/YOUR_USERNAME/mermaid-vscode-extension/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- [Mermaid](https://mermaid-js.github.io/) - The amazing diagramming library
- [mermaid-cli](https://github.com/mermaid-js/mermaid-cli) - Command line interface
- VS Code Team - For the excellent extension API

---

**Enjoy creating beautiful diagrams in your Python code! 🎨**
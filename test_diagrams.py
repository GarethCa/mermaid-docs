"""
Simple test file to verify Mermaid diagram functionality.
"""


def test_simple_diagram():
    """
    A simple test function with a basic Mermaid diagram.

    ```mermaid
    graph TD
        A[Test Start] --> B[Processing]
        B --> C[Test End]
        style A fill:#9f6
        style C fill:#f96
    ```

    This should render both inline and in webview.
    """
    return "Test complete"


def test_flowchart():
    """
    Another test with a different diagram type.

    ```mermaid
    flowchart LR
        X[Input] --> Y{Decision}
        Y -->|Yes| Z[Action]
        Y -->|No| W[Alternative]
    ```
    """
    pass

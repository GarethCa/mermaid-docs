"""
Sample Python file with Mermaid diagrams in docstrings.
This file demonstrates the extension's capability to extract and render
Mermaid diagrams from Python function and class docstrings.
"""


def process_workflow():
    """
    Process a typical workflow with decision points.

    This function demonstrates a workflow process that can be visualized
    using a Mermaid diagram:

    ```mermaid
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
    ```

    Returns:
        str: The result of the workflow processing
    """
    return "Workflow completed successfully"


class DataAnalyzer:
    """
    A class for analyzing data with multiple stages.

    The data analysis pipeline can be visualized as follows:

    ```mermaid
    graph LR
        A[Raw Data] --> B[Clean Data]
        B --> C[Transform]
        C --> D[Analyze]
        D --> E[Visualize]
        E --> F[Report]
        style A fill:#e1f5fe
        style F fill:#c8e6c9
    ```
    """

    def __init__(self, data):
        """Initialize the analyzer with data."""
        self.data = data

    def analyze(self):
        """
        Perform the analysis with detailed steps.

        The analysis process involves several decision points:

        ```mermaid
        flowchart TD
            A[Load Data] --> B{Data Valid?}
            B -->|Yes| C[Preprocessing]
            B -->|No| D[Data Cleaning]
            D --> C
            C --> E[Feature Engineering]
            E --> F[Model Training]
            F --> G[Validation]
            G --> H{Performance OK?}
            H -->|Yes| I[Deploy Model]
            H -->|No| J[Tune Hyperparameters]
            J --> F
            style I fill:#4caf50
            style J fill:#ff9800
        ```
        """
        pass


def simple_function():
    """
    A function without any Mermaid diagrams.
    This should not trigger any diagram rendering.
    """
    return "No diagrams here"


def network_topology():
    """
    Describe network topology and connections.

    ```mermaid
    graph TB
        subgraph "Frontend"
            A[Web Browser]
            B[Mobile App]
        end

        subgraph "Backend"
            C[Load Balancer]
            D[API Server 1]
            E[API Server 2]
            F[Database]
        end

        A --> C
        B --> C
        C --> D
        C --> E
        D --> F
        E --> F

        style A fill:#2196f3
        style B fill:#2196f3
        style C fill:#ff9800
        style F fill:#4caf50
    ```

    This shows how requests flow through the system.
    """
    pass

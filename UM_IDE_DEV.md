# Developer's Guide

This guide provides instructions for setting up your development environment, configuring the project, and running/debugging the application using WebStorm and Mise.

## 1. Setting Up the Development Environment

This project uses [Mise](https://mise.jdx.dev/) to manage tool versions (Node.js, Yarn, etc.). This ensures that all developers are using the same versions as defined in the `.mise.toml` file.

### Prerequisites
- [WebStorm IDE](https://www.jetbrains.com/webstorm/)
- [Mise](https://mise.jdx.dev/getting-started.html) installed on your system.

### Step-by-Step Setup
1.  **Install Tools via Mise**:
    Open your terminal in the project root and run:
    ```bash
    mise trust
    mise install
    ```
    This will install the versions of Node.js and Yarn specified in `.mise.toml` (Node 18 and Yarn 1). Note: `mise trust` isn't necessary in this project since there are no external entities to trust but is a good habit to form when using Mise.

2.  **Configure WebStorm to use Mise**:
    To ensure WebStorm uses the Mise-managed versions of Node.js and Yarn:
    -   **Node.js Interpreter**:
        1.  Open `Settings` (macOS: `⌘,`, Windows/Linux: `Ctrl+Alt+S`).
        2.  Navigate to `Languages & Frameworks > Node.js`.
        3.  Click the `...` next to **Node interpreter** and select **Add...**.
        4.  Provide the path to the Node binary managed by Mise. You can find this path by running `mise where node` in your terminal (e.g., `~/.local/share/mise/installs/node/18/bin/node`).
    -   **Yarn Package Manager**:
        1.  In the same `Node.js` settings page, under **Package manager**, select the path to the Yarn executable managed by Mise.
        2.  Find the path by running `mise where yarn` (e.g., `~/.local/share/mise/installs/yarn/1/bin/yarn`).

## 2. Project Configuration

### Application Configuration
The DSpace Angular application uses YAML files for environment-specific settings. For local development, the configuration is managed via `config/config.development.yml`.

#### `config/config.development.yml` Contents:
```yaml
rest:
  ssl: false
  host: localhost
  port: 8080
  # nameSpace is capitalized; 'namespace' is reserved in TypeScript
  nameSpace: /server
```

#### Explanation:
-   **`rest.ssl`**: Set to `false` for local development as the backend typically doesn't use HTTPS locally.
-   **`rest.host`**: Set to `localhost` to connect to the backend running on your local machine.
-   **`rest.port`**: Set to `8080`, which is the default port for the DSpace REST API when running via IntelliJ IDEA.
-   **`rest.nameSpace`**: Set to `/server`, the default context path for the REST API.

### Configuring the IDE for Mise
Beyond setting the interpreter, ensure your WebStorm terminal is aware of Mise by adding the following to your shell profile (e.g., `.zshrc` or `.bashrc`):
```bash
eval "$(mise activate zsh)"
```
This ensures that whenever you open the terminal in WebStorm, the `node` and `yarn` commands automatically point to the correct versions.

## 3. Run Configuration and Debugging

### Assumptions
-   A local DSpace backend is running in **IntelliJ IDEA**.
-   The backend is accessible at `http://localhost:8080/server`.

### Creating a Run Configuration
1.  In WebStorm, click on the **Run Configuration** dropdown in the top-right corner and select **Edit Configurations...**.
2.  Click the **+** (Add New Configuration) button and select **npm**.
3.  Configure the following fields:
    -   **Name**: `Run Development`
    -   **Command**: `run`
    -   **Scripts**: `start:dev`
4.  Click **OK**.

### How to Debug
1.  **Server-Side Debugging**:
    Click the **Debug** icon (the green bug) next to the `Run Development` configuration. WebStorm will start the application in debug mode. You can set breakpoints in your TypeScript code, and the execution will pause when hit, allowing you to inspect variables and state.

2.  **Client-Side Debugging**:
    While the application is running, you can debug the browser-side code:
    -   Create a new **JavaScript Debug** configuration in WebStorm.
    -   Set the **URL** to `http://localhost:4000`.
    -   Click the **Debug** icon. This will launch a new browser instance connected to WebStorm's debugger.

3.  **Using Breakpoints**:
    Click in the gutter (the space next to the line numbers) in your `.ts` files to set breakpoints. WebStorm handles the source mapping automatically, so you can debug the original TypeScript code even though the browser is running compiled JavaScript.

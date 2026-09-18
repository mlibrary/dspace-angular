Now I'm opening the mise.toml file to understand the project's configuration and dependencies, which will help me determine the environment and setup details relevant to the task.

**How WebStorm Uses Tools Managed by `mise`**

By default, WebStorm does not automatically parse `mise.toml` out of the box like a native mise client, but **WebStorm can seamlessly use mise-managed tools** (`node`, `yarn`, `npm`) through your environment and IDE settings.

Here is how WebStorm interacts with mise and how to ensure WebStorm uses the exact versions defined in `mise.toml`:

---

**1. In the WebStorm Built-in Terminal**

If you have mise activated in your shell configuration (e.g., `eval "$(mise activate zsh)"` or `~/.local/share/mise/shims` in your `PATH` in `~/.zshrc` or `~/.bashrc`):
- Any command executed inside the WebStorm Terminal (`yarn`, `npm`, `node`, `ng`) automatically uses the versions resolved by mise from `mise.toml` (e.g., Node 18, Yarn 1).

---

**2. For IDE Run Configurations, Indexing, and Tooling**

WebStorm needs to know which Node.js interpreter and package manager to use for GUI run configurations, code completion, and TypeScript/Angular language services:

**A. Node.js Interpreter**
1. Go to **Settings / Preferences** (`Cmd + ,` on macOS) -> **Languages & Frameworks** -> **Node.js**.
2. Click the dropdown for **Node interpreter** and select the mise-installed Node version:
  - WebStorm often detects versions in `~/.local/share/mise/installs/node/<version>/bin/node`.
  - Alternatively, you can point directly to the mise shim: `~/.local/share/mise/shims/node`.

**B. Package Manager (Yarn)**
1. In the same **Node.js** settings page, locate the **Package manager** field.
2. Ensure it is set to the Yarn binary managed by mise (e.g., `~/.local/share/mise/installs/yarn/...` or `~/.local/share/mise/shims/yarn`).

---

**3. Launching WebStorm with mise Environment**

To ensure WebStorm inherits all environment variables and path overrides from mise when running from GUI:
- **From CLI**: Run `webstorm .` inside the project directory. This launches WebStorm with your active shell's environment, so WebStorm immediately inherits the correct toolchain.
- **JetBrains mise Plugin**: You can install community plugins (such as **mise** / **asdf** integration plugins) from **Settings -> Plugins -> Marketplace** to enable automatic environment variable syncing and interpreter switching based on `mise.toml`.

---

**Summary for This Project (`mise.toml`)**

In `dspace-angular`:
- `node = "18"`
- `npm = "10"`
- `yarn = "1"`

Once you point WebStorm's **Node interpreter** (in `Settings -> Languages & Frameworks -> Node.js`) to your Node 18 mise installation or shim, all WebStorm GUI run buttons (such as running `start:dev` from `package.json` or running Karma tests) will execute using your mise toolchain.
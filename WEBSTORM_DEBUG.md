Now I'm opening WEBSTORM.md to understand the initial content and structure of this documentation file, focusing on the first line to grasp its purpose or key information.

To debug the `dspace-angular` application in WebStorm, you can debug **client-side Angular code in the browser**, **server-side Node/SSR scripts**, or **unit tests (Karma)** directly with WebStorm breakpoints.

---

**1. Debugging Client-Side (Angular Browser Code)**

This is the standard way to debug Angular components, services, and UI logic in TypeScript files using WebStorm breakpoints.

**Step 1: Start the Development Server**
1. Start the dev server using any method:
  - Open `package.json`, click the green Play icon next to `"start:dev"`, and select **Run 'start:dev'**.
  - Or run `yarn start:dev` in the WebStorm terminal.
2. Wait until the compilation is complete and the app is served at `http://localhost:4000` (or `http://localhost:4000/documents` depending on your base href).

**Step 2: Attach the WebStorm Debugger**

**Method A: Using a JavaScript Debug Configuration (Recommended)**
1. Go to **Run -> Edit Configurations...** in the top menu.
2. Click the `+` button in the top left and select **JavaScript Debug**.
3. Configure the fields:
  - **Name**: `Debug Angular (Browser)`
  - **URL**: `http://localhost:4000/` (or `http://localhost:4000/documents`)
  - **Browser**: Select **Chrome** (or your preferred Chromium-based browser).
4. Click **OK**.
5. Set breakpoints in any TypeScript file (e.g., in `src/app/...`) by clicking in the gutter next to the line number.
6. Select `Debug Angular (Browser)` from the run configurations dropdown in the top toolbar and click the **Debug** icon (the bug icon or `Control + D` / `Shift + F9`).
7. WebStorm will open a browser instance connected to its debugger. When you navigate the application or trigger actions, execution will pause on your breakpoints in WebStorm.

**Method B: Quick Debug from Console URL**
1. When `start:dev` is running, locate the output URL `http://localhost:4000` printed in the **Run** or **Terminal** console.
2. Hold `Cmd + Shift` (macOS) or `Ctrl + Shift` (Windows/Linux) and click the URL, or hover over the URL and click **Debug URL**.
3. WebStorm will automatically launch a debugging session attached to that URL.

---

**2. Debugging Unit Tests (Karma / Jasmine)**

You can debug individual test cases or entire test suites in WebStorm:

1. Open any spec file (e.g., `*.spec.ts`).
2. Set a breakpoint on the line you want to inspect inside a `describe()` or `it()` block.
3. Click the **green Run icon** in the editor gutter next to the `describe` or `it` block and select **Debug '...'**.
4. WebStorm will launch Karma in debug mode, open Chrome, and halt at your breakpoints inside WebStorm where you can inspect variables, evaluate expressions, and step through code.

Alternatively, use the existing **Tests (dspace-angular)** Karma configuration in `Run -> Edit Configurations...`.

---

**3. Debugging Server-Side / Node.js Scripts (SSR & Scripts)**

If you need to debug server-side rendering (`server.ts` / `serve:ssr`) or custom scripts in `scripts/`:

1. Go to **Run -> Edit Configurations...**.
2. Click `+` and choose **npm** or **Node.js**:
  - For `npm`: Set **Command** to `run`, **Scripts** to `serve:ssr` (after building) or `start:dev`.
  - Ensure the Node.js interpreter is set to your active Node environment.
3. Click the **Debug** icon to run the script under the Node.js debugger.
4. Set breakpoints in server files like `server.ts` or files in `scripts/`.

---

**4. Tips for Effective Debugging in WebStorm**

- **Variables & Watches**: When paused at a breakpoint, use the **Debug** tool window (`Cmd + 5` / `Alt + 5`) to inspect variables in the **Variables** tab or add expressions to the **Watches** tab.
- **Evaluate Expression**: Press `Option + F8` (macOS) or `Alt + F8` (Windows/Linux) while paused to evaluate any arbitrary TypeScript/JavaScript expression in the current execution scope.
- **Stepping Controls**:
  - `F8` (Step Over): Move to the next line in the current function.
  - `F7` (Step Into): Step inside the function call.
  - `Shift + F8` (Step Out): Finish current function and return to caller.
  - `Option + Cmd + R` / `F9` (Resume Program): Continue execution until the next breakpoint.
- **Conditional Breakpoints**: Right-click any breakpoint red dot to add a condition expression so it only pauses when the condition evaluates to `true`.
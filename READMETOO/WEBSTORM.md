Now I'm reviewing the run configurations to understand how the project is executed and tested, then I'll examine the package.json to identify key scripts and dependencies that define the project's setup and workflow.

To run the `dspace-angular` frontend in WebStorm, follow the steps below:

**1. Prerequisites & Configuration**

Before running the app, ensure dependencies are installed and the configuration file is present:

1. **Install dependencies** (if not done already):
   Open the WebStorm terminal (`Option + F12` on macOS or `Alt + F12` on Windows/Linux) and run:
   ```shell
   yarn install
   ```

2. **Create the environment config**:
   Create `./config/config.dev.yml` in the project root:
   ```yaml
   rest:
     ssl: false
     host: localhost
     port: 8080
   auth:
     showPasswordLogin: true
   ```
   *(Set `showPasswordLogin: false` if using OIDC login instead of password authentication.)*

---

**2. Running via WebStorm GUI**

You can start the frontend using one of the following methods in WebStorm:

**Option A: Direct from `package.json` (Recommended)**
1. Open `package.json`.
2. Locate the `"start:dev"` script in the `"scripts"` object (around line 9).
3. Click the **green Run (Play)** arrow in the editor gutter next to `"start:dev"` and choose **Run 'start:dev'** (or **Debug 'start:dev'**).

**Option B: Using the `npm` Tool Window**
1. Open the **npm** tool window via `View -> Tool Windows -> npm` (or find the **npm** tab on the side toolbars).
2. Double-click the `start:dev` script to launch it.

**Option C: Create a Dedicated Run Configuration**
1. Go to `Run -> Edit Configurations...` in the top menu.
2. Click the `+` button in the top-left and select **npm**.
3. Configure the fields:
  - **Name**: `Run Frontend (Dev)`
  - **Package.json**: Select `/path/to/dspace-angular/package.json`
  - **Command**: `run`
  - **Scripts**: `start:dev`
  - **Package manager**: `yarn`
4. Click **OK**.
5. Select `Run Frontend (Dev)` in the top toolbar and click the green **Run** or **Debug** button.

---

**3. Running via WebStorm Terminal**

Open the built-in Terminal in WebStorm (`Option + F12` / `Alt + F12`) and run:
```shell
yarn start:dev
```

---

**4. Accessing the Application**

Once the server starts and compilation finishes, access the frontend at:
- `http://localhost:4000/documents` or `http://localhost:4000/`

*(Note: Ensure your local backend service is running on port `8080` as configured in `config.dev.yml`.)*
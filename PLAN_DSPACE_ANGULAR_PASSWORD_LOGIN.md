# Plan: Restore Password Login Form in DSpace Angular (Config-Driven Toggle)

**Repository:** `mlibrary/dspace-angular`
**Branch:** `show-password-login`
**Status:** ✅ Code complete — unit tests passing — pending demo Kubernetes config (Task 9)
**Approach:** Config-driven `showPasswordLogin` flag so production/workshop behaviour is unchanged

---

## Background

Deep Blue Documents (University of Michigan Library's DSpace 7.6 institutional repository)
has three Kubernetes environments: production, workshop, and demo.

**Demo environment architecture (as of 2026-04-29):**

1. **Gate layer** — `oauth2-proxy` sits in front of the application and requires U-M WebLogin
   (Shibboleth OIDC) before any request reaches DSpace. This restricts demo access to
   U-M people only. Deployed at `demo.deepblue-documents.lib.umich.edu`.

2. **Application layer** — Once past the gate, users must explicitly log in to DSpace using a
   **username/password** from the DSpace EPerson table. This allows testers to switch
   personas (admin, depositor, reader, etc.) using a set of shared generic test accounts.
   DSpace's own internal OIDC authentication is intentionally **disabled** for demo — if it
   were enabled, clicking "Log In" would immediately auto-log the user in as their own
   umich.edu identity (since they're already authenticated at the gate), defeating the purpose
   of having generic test personas.

**The problem:** A UM-specific customisation in `log-in.component.html` filtered the password
authentication method out of the login UI with `*ngIf="authMethod.authMethodType !== 'password'"`.
With DSpace OIDC disabled for demo, this left a completely blank login form.

**The constraint:** Simply removing the filter would show the password form on production and
workshop too, where only the OIDC button should appear. A config-driven exclusive toggle is
used so the password form is opt-in per environment.

---

## The Behaviour — Exclusive Toggle

The `showPasswordLogin` config flag is an **exclusive toggle**: exactly one login method type
renders at a time — never both, never none.

| `showPasswordLogin` | `authMethodType` | rendered? | environment |
|---|---|---|---|
| `false` (default) | `'oidc'` | ✅ OIDC button shown | production, workshop |
| `false` (default) | `'password'` | ❌ password form hidden | production, workshop |
| `true` | `'password'` | ✅ password form shown | demo |
| `true` | `'oidc'` | ❌ OIDC button hidden | demo |

**Default is `false`** — all environments that do not set the flag behave exactly as before.
Only demo opts in by setting the flag to `true`.

---

## Implementation Status (as of 2026-04-29)

All code changes are committed to the `show-password-login` branch in commit `54c6b93c4`.
Unit tests pass (commit `531f1e703`). The one remaining step is the Kubernetes env-var for demo.

### What was changed

#### `src/config/auth-config.interfaces.ts`
Added optional `showPasswordLogin?: boolean` to the `AuthConfig` interface:
```typescript
// When true, the username/password login form is rendered and OIDC is hidden (exclusive toggle).
// Set to false (default) to show only OIDC/non-password methods (production/workshop behaviour).
// Set to true for environments where DSpace OIDC is disabled and password auth is required (demo).
showPasswordLogin?: boolean;
```

#### `src/config/default-app-config.ts`
Added `showPasswordLogin: false` to the `auth` block — this is the default for all environments:
```typescript
auth: AuthConfig = {
  ui: { ... },
  rest: { ... },
  showPasswordLogin: false,  // ← default; omitting it also gives false via ?? false
};
```

#### `src/app/shared/log-in/log-in.component.ts`
- Added `Inject` to `@angular/core` import.
- Added `import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface'`.
- Declared `public showPasswordLogin: boolean` property.
- Added `@Inject(APP_CONFIG) private appConfig: AppConfig` as final constructor parameter.
- At top of `ngOnInit()`: `this.showPasswordLogin = this.appConfig.auth?.showPasswordLogin ?? false;`

#### `src/app/shared/log-in/log-in.component.html`
Replaced hard-coded exclusion with exclusive-toggle condition:
```html
<!-- BEFORE -->
*ngIf="authMethod.authMethodType !== 'password'"

<!-- AFTER -->
*ngIf="showPasswordLogin === (authMethod.authMethodType === 'password')"
```

#### `src/app/shared/log-in/log-in.component.spec.ts`
- Added `APP_CONFIG` and `environment` imports; provided `APP_CONFIG` in `TestBed`.
- Updated assertion from `toBe(2)` to `toBe(1)` (with `showPasswordLogin: false`, only the
  shibboleth method from `authMethodsMock` renders).

#### `config/config.example.yml`
Added operator-facing documentation in the `auth:` block:
```yaml
# When true, show the username/password login form and hide OIDC (exclusive toggle).
# Set to true only on environments where DSpace OIDC is disabled (e.g. demo).
# Default: false (OIDC button shown, password form hidden — production/workshop behaviour).
# Can also be set via environment variable: DSPACE_AUTH_SHOWPASSWORDLOGIN=true
# showPasswordLogin: false
```

---

## How to Configure for Demo

The `config/config.yml` in this repo is **not** the demo config. The demo override is applied
via environment variable in the frontend Kubernetes Deployment/ConfigMap
(in `mlibrary/deepblue-documents-kube`, **not** this repo):

```
DSPACE_AUTH_SHOWPASSWORDLOGIN=true
```

This follows the DSpace Angular environment-variable naming convention
(see `docs/Configuration.md`): replace `.` with `_`, uppercase, prefix with `DSPACE_`.

Alternatively, the demo-mounted `config.yml` can include:
```yaml
auth:
  showPasswordLogin: true
```

**Production and workshop** must NOT set this variable — omitting it leaves the default
`false`, preserving the current OIDC-only login behaviour.

---

## Why This Change Is Safe

- **Default is `false`** — every environment that doesn't set the flag is unchanged.
- **Production** — no config change → `showPasswordLogin: false` → OIDC button shown, password hidden. ✅
- **Workshop** — same as production. ✅
- **Demo** — `DSPACE_AUTH_SHOWPASSWORDLOGIN=true` → password form shown, OIDC button hidden. ✅
- The `ds-log-in-container` component's `rendersAuthMethodType` decorator handles each auth
  method type correctly; the only change is which methods pass the `*ngIf` gate.

---

## How the Auth Methods List Is Populated

`log-in.component.ts` subscribes to `getAuthenticationMethods` from the NgRx store, which
is populated from the DSpace REST API response at `/api/authn`. The backend returns available
methods as HAL links:

- `_links.login` → password auth available (`authMethodType: 'password'`)
- `_links.oidcLogin` → OIDC auth available (`authMethodType: 'oidc'`)

IP auth is explicitly filtered by `log-in.component.ts` before the template sees the list.

**Demo backend returns** (DSpace OIDC disabled — only `login` link present):
```json
{
  "_links": {
    "login": { "href": "https://backend.demo.deepblue-documents.lib.umich.edu/server/api/authn/login" }
  }
}
```
`authMethods` = `[{ authMethodType: 'password' }]`. With `showPasswordLogin: true`, the
password form renders. With the default `false` it would be filtered out (blank form).

---

## Config System Deep-Dive — How the Env-Var Reaches the Component

This section exists so that if the flag doesn't appear to work, an agent or operator can
trace exactly where the breakdown is.

### The chain (server-side rendering path)

1. **`server.ts` (startup):**
   ```typescript
   const appConfig = buildAppConfig(join(DIST_FOLDER, 'assets/config.json'));
   extendEnvironmentWithAppConfig(environment, appConfig);
   // ...
   { provide: APP_CONFIG, useValue: environment }
   ```
   `buildAppConfig` reads `DefaultAppConfig`, merges `config/config.yml`, then calls
   `overrideWithEnvironment(appConfig)` which walks every property and checks for a matching
   `DSPACE_*` env-var. For `auth.showPasswordLogin`, it looks for `DSPACE_AUTH_SHOWPASSWORDLOGIN`.

2. **`overrideWithEnvironment` (in `src/config/config.server.ts`) — key details:**
   - Requires the property to **already exist** in the config object (it only walks existing
     properties). Because `DefaultAppConfig` sets `showPasswordLogin: false`, this property
     exists and will be found. ✅
   - Checks `isNotEmpty(innerConfig)` before processing. Verified: `isNotEmpty(false) === true`,
     so a default of `false` does **not** cause the env-var to be silently ignored. ✅
   - Uses `getBooleanFromString(value)` for boolean properties:
     `'true' === 'true' || 'true' === '1'` → actual boolean `true`. ✅
     The component reads a proper boolean, not the string `"true"`.

3. **`extendEnvironmentWithAppConfig`** mutates the `environment` object in place via `deepmerge`,
   so `environment.auth.showPasswordLogin` becomes `true`.

4. **`APP_CONFIG` token** is provided as `useValue: environment` — the now-extended object.
   `LogInComponent` injects it and reads `appConfig.auth?.showPasswordLogin ?? false` → `true`.

5. **SSR → browser transfer:** `saveAppConfigForCSR()` writes `environment` (already extended)
   to Angular's `TransferState`. The browser-side `BrowserInitService` reads it back. The same
   `true` value reaches the browser without an additional network round-trip.

### How to verify the env-var was applied at startup

The server logs this line when an env-var override fires:
```
Applying environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN with value true
```
Check the frontend pod logs immediately after startup. If this line is absent, the env-var
was not set in the environment, or was set with an unexpected key/value.

### On-host config inspection shortcut

At startup, `buildAppConfig` writes the final computed config to:
```
dist/browser/assets/config.json
```
This is a plain JSON file. After the pod is running, inspect it with:
```shell
kubectl -n demo exec deploy/frontend -- cat /app/dist/browser/assets/config.json | python3 -m json.tool | grep -A2 showPassword
```
Expected output when correctly configured:
```json
"auth": {
  ...
  "showPasswordLogin": true
}
```

### YAML config alternative — deep-merge safety

When using `auth.showPasswordLogin: true` in the mounted `config.yml` (rather than the env-var),
`mergeConfig` uses `deepmerge`. The `auth` block is deep-merged, so specifying only
`showPasswordLogin` will not clobber `auth.ui` or `auth.rest`. The full auth block does not
need to be re-specified. ✅

---

## Remaining Step — Task 9 (different repo)

In `mlibrary/deepblue-documents-kube`, add to the **frontend** demo Deployment/ConfigMap:
```
DSPACE_AUTH_SHOWPASSWORDLOGIN=true
```

File: `environments/deepblue-documents/demo/` (frontend ConfigMap, not the backend one).

Confirm production and workshop frontend ConfigMaps do **not** set this variable.

---

## Verification Steps (after demo deployment)

1. Navigate to `https://demo.deepblue-documents.lib.umich.edu` — U-M WebLogin gate challenges.
2. After passing the gate, click **Log In** in the navbar dropdown.
3. A username/password form should now appear (no OIDC button).
4. Log in using the designated demo DSpace credentials from the restricted-access operations runbook or secret manager reference.
5. Confirm login succeeds and user appears as logged in within the DSpace UI.
6. Log out, then log in using a second designated demo test account from the same restricted-access source to confirm persona switching.

For workshop/production: login dropdown still shows **only** the OIDC button. No password form. ✅

---

## Demo Test Accounts

Demo account identifiers, password values, and password-reset procedures must not be stored in this repository.
Refer to the restricted-access operations runbook / secret manager for current demo credentials and account handling instructions.

# DONE — show-password-login implementation

Tasks completed and committed to the `show-password-login` branch.

---

## ✅ Branch created

- Branch `show-password-login` cut from `umich` / `issue-working`.

---

## ✅ Plan document written and committed

- **Commit:** `90a6627c3` — "Initial Plan"
- **File:** `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md`
- Describes the problem, the config-driven exclusive-toggle approach, all four source-file
  changes, the demo-only config override, a truth table, and verification steps.

---

## ✅ Tracking files created and committed

- **Commit:** `7485e2d6c` — "docs: add TODO, DONE, and AGENTS tracking files for showPasswordLogin feature"
- **Files:** `TODO.md`, `DONE.md`, `AGENTS.md`

---

## ✅ Tasks 1–6: source changes implemented and committed

- **Commit:** `54c6b93c4` — "feat: config-driven showPasswordLogin exclusive toggle (DEEPBLUE-466)"

### Task 1 — `src/config/auth-config.interfaces.ts`
Added `showPasswordLogin?: boolean` to the `AuthConfig` interface with JSDoc comment.

### Task 2 — `src/config/default-app-config.ts`
Added `showPasswordLogin: false` to the `auth` block in `DefaultAppConfig`.

### Task 3 — `src/app/shared/log-in/log-in.component.ts`
- Added `Inject` to `@angular/core` import.
- Added `import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface'`.
- Declared `public showPasswordLogin: boolean` property.
- Added `@Inject(APP_CONFIG) private appConfig: AppConfig` as last constructor parameter.
- Set `this.showPasswordLogin = this.appConfig.auth?.showPasswordLogin ?? false` at top of `ngOnInit()`.

### Task 4 — `src/app/shared/log-in/log-in.component.html`
Changed `*ngIf` from:
```html
*ngIf="authMethod.authMethodType !== 'password'"
```
to the exclusive toggle:
```html
*ngIf="showPasswordLogin === (authMethod.authMethodType === 'password')"
```

### Task 5 — `src/app/shared/log-in/log-in.component.spec.ts`
- Added `APP_CONFIG` and `environment` imports.
- Added `{ provide: APP_CONFIG, useValue: environment }` to `TestBed` providers.
- Updated assertion from `toBe(2)` to `toBe(1)` (only shibboleth renders with `showPasswordLogin: false`).

### Task 6 — `config/config.example.yml`
Added commented-out `showPasswordLogin` entry with documentation in the `auth:` block.

---

## ✅ Task 7: Unit test confirmed passing

- **Commit:** `531f1e703` — "fix: resolve pre-existing TypeScript errors in base-branch spec files to unblock test run"

The `umich` base branch had 14 pre-existing TypeScript errors across 9 spec files that
prevented `ng test` from starting. These were fixed to unblock test verification:

- `src/environments/environment.test.ts` — added missing `serverLocation: 'http://localhost:8080/server'`
- `src/app/item-page/edit-item-page/item-withdraw/item-withdraw.component.spec.ts` — added missing `reason` arg to `setWithDrawn` assertion
- `src/app/item-page/edit-item-page/item-reinstate/item-reinstate.component.spec.ts` — same
- 6 bitstream-format spec files — renamed old enum values to current names:
  - `Unknown` → `AS_IS_UNKNOWN`
  - `Known` → `AS_IS_KNOWN`
  - `Supported` → `HIGHEST_LEVEL`

**Test result:** ✅ 2 specs, 0 failures
```
✔ should render a log-in container component for each auth method available
✔ should create LogInComponent
TOTAL: 2 SUCCESS
```

# DONE — mlibrary/dspace-angular

Completed work items, grouped by feature. Each group links to its plan document and
the PR that merged it.

---

## ✅ Config-driven `showPasswordLogin` toggle (DEEPBLUE-466)

**Plan:** `plans/PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md`
**Branch:** `show-password-login` → merged to `umich` as **PR #94**

### What was done

**Source changes** (commit `54c6b93c4` — `feat: config-driven showPasswordLogin exclusive toggle`):

- `src/config/auth-config.interfaces.ts` — added `showPasswordLogin?: boolean` to `AuthConfig`.
- `src/config/default-app-config.ts` — added `showPasswordLogin: false` to the `auth` block.
- `src/app/shared/log-in/log-in.component.ts` — injected `APP_CONFIG`; set
  `this.showPasswordLogin = this.appConfig.auth?.showPasswordLogin ?? false` in `ngOnInit()`.
- `src/app/shared/log-in/log-in.component.html` — replaced hard-coded
  `*ngIf="authMethod.authMethodType !== 'password'"` with the exclusive toggle
  `*ngIf="showPasswordLogin === (authMethod.authMethodType === 'password')"`.
- `config/config.example.yml` — added commented-out `showPasswordLogin` entry with docs.

**Pre-existing spec fixes** (commit `531f1e703`):
14 TypeScript errors across 9 spec files on the base branch were blocking `ng test`.
Fixed: missing `serverLocation` in `environment.test.ts`, wrong `setWithDrawn` arity,
and stale bitstream-format enum names (`Unknown`/`Known`/`Supported` →
`AS_IS_UNKNOWN`/`AS_IS_KNOWN`/`HIGHEST_LEVEL`).

**Spec strengthened** (commits `838275570`, `d46949e32`, `3c57ff73f`):
- Added `APP_CONFIG` provider to `TestBed`.
- Updated container count assertion from `toBe(2)` → `toBe(1)`.
- Added test for `showPasswordLogin: true` using direct property mutation +
  `By.directive(LogInPasswordComponent)` / `By.directive(LogInExternalProviderComponent)`
  to prove which method renders, not just the count.
- Renamed `it()` descriptions to reflect exclusive-toggle semantics.

### Pending (out-of-band)
- Set `DSPACE_AUTH_SHOWPASSWORDLOGIN=true` in the demo Kubernetes ConfigMap
  (`mlibrary/deepblue-documents-kube`). Tracked in `TODO.md` Task 9.

---

## ✅ Task A — Generalize coding-agent markdown files

**Branch:** `clean-up` → merged to `umich` as **PR #___**

- Moved `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` → `plans/`.
- Rewrote `AGENTS.md` as repo-wide guidance (removed feature-specific content;
  added repo overview, general coding guidelines, reusable codebase patterns,
  plans index).
- Rewrote `TODO.md` to support multiple parallel work items.
- Rewrote `DONE.md` (this file) as a general feature archive.
- Added `plans/PLAN_TEMPLATE.md` for future features.

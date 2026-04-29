# AGENTS.md — Coding Agent Guidelines for `show-password-login`

## Purpose

This file gives a coding agent everything it needs to continue (or complete) the
`show-password-login` feature branch in `mlibrary/dspace-angular` without needing
to ask the human for context.

---

## Repository & Branch

| Item | Value |
|---|---|
| Repo | `mlibrary/dspace-angular` |
| Active branch | `show-password-login` |
| Base branch | `umich` / `issue-working` |
| Framework | Angular 14 / DSpace 7.6 |
| Language | TypeScript + HTML templates |

---

## The Problem Being Solved

A UM-specific customisation in `src/app/shared/log-in/log-in.component.html` hard-codes
the password auth method out of the login UI:

```html
*ngIf="authMethod.authMethodType !== 'password'"
```

On the **demo** environment, DSpace OIDC is disabled, making `password` the only advertised
auth method — leaving a completely blank login form. No one can log in to demo.

Full context: read `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md`.

---

## The Chosen Solution

A **config-driven exclusive toggle**: a new `showPasswordLogin` boolean in `AuthConfig`.

- `false` (default) → show OIDC/non-password methods only. Production & workshop unchanged.
- `true` (demo only) → show password form only, hide OIDC.

Template condition (exclusive — never both, never none):
```html
*ngIf="showPasswordLogin === (authMethod.authMethodType === 'password')"
```

---

## Work Tracking Files

| File | Purpose |
|---|---|
| `TODO.md` | Remaining tasks in priority order — work from top to bottom |
| `DONE.md` | Completed tasks — move items here when a task is committed |
| `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` | Full design rationale and exact code snippets |

**Always check `TODO.md` first** to see what still needs doing.
**After completing and committing each task**, move it from `TODO.md` to `DONE.md`.

---

## Key Files to Know

| File | Role |
|---|---|
| `src/config/auth-config.interfaces.ts` | `AuthConfig` interface — add `showPasswordLogin?: boolean` |
| `src/config/default-app-config.ts` | `DefaultAppConfig` class — set `showPasswordLogin: false` in `auth` block |
| `src/app/shared/log-in/log-in.component.ts` | Inject `APP_CONFIG`, read flag, expose as `showPasswordLogin` property |
| `src/app/shared/log-in/log-in.component.html` | Replace `*ngIf` with exclusive-toggle condition |
| `src/app/shared/log-in/log-in.component.spec.ts` | Unit test — needs `APP_CONFIG` provided and assertion updated to `toBe(1)` |
| `src/app/shared/testing/auth-service.stub.ts` | `authMethodsMock` = `[password, shibboleth]` — used by the spec |
| `src/environments/environment.test.ts` | Full `auth:` block used by specs; does NOT have `showPasswordLogin` (omitting it is fine — `undefined ?? false` → `false`) |
| `config/config.example.yml` | Operator reference — add commented-out `showPasswordLogin` entry in the `auth:` block |

---

## How `APP_CONFIG` Is Used in This Codebase

`APP_CONFIG` is an Angular `InjectionToken<AppConfig>` defined in
`src/config/app-config.interface.ts`. Inject it into a component constructor like this:

```typescript
import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface';
// Path from src/app/shared/log-in/ → three levels up → src/config/

constructor(
  // ...existing params...
  @Inject(APP_CONFIG) private appConfig: AppConfig
) {}
```

Existing examples to reference:
- `src/app/community-list-page/community-list-service.ts`
- `src/app/item-page/edit-item-page/virtual-metadata/virtual-metadata.component.ts`

In test files, provide it as:
```typescript
import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
// ...
{ provide: APP_CONFIG, useValue: environment }
```

`environment` (resolves to `environment.test.ts` during tests) has a full `auth:` block
but no `showPasswordLogin` key. That is fine — the component reads it as
`appConfig.auth?.showPasswordLogin ?? false`, so `undefined ?? false` → `false`.
No change to `environment.test.ts` is required.

---

## Spec File Notes

`src/app/shared/log-in/log-in.component.spec.ts` currently has:

```typescript
it('should render a log-in container component for each auth method available', () => {
  const loginContainers = fixture.debugElement.queryAll(By.css('ds-log-in-container'));
  expect(loginContainers.length).toBe(2);  // ← must change to toBe(1)
});
```

`authMethodsMock` contains `[password, shibboleth]`. With `showPasswordLogin: false` (default),
only `shibboleth` renders → `toBe(1)`. The `APP_CONFIG` token must also be added to
`providers` in `TestBed.configureTestingModule` or the component will fail to construct.

---

## `config/config.example.yml` — Operator Documentation

The `auth:` block in `config/config.example.yml` (around line 91–102) must have a
commented-out `showPasswordLogin` entry added so operators know the option exists:

```yaml
# When true, show the username/password login form and hide OIDC (exclusive toggle).
# Set to true only on environments where DSpace OIDC is disabled (e.g. demo).
# Default: false (OIDC button shown, password form hidden — production/workshop behaviour).
# Can also be set via environment variable: DSPACE_AUTH_SHOWPASSWORDLOGIN=true
# showPasswordLogin: false
```

---

## Config Override for Demo (Out-of-Band)

The demo Kubernetes frontend Deployment/ConfigMap (in `mlibrary/deepblue-documents-kube`,
**not** this repo) must set:

```
DSPACE_AUTH_SHOWPASSWORDLOGIN=true
```

This task is tracked in `TODO.md` item 9. It is performed separately from this repo's code changes.

---

## Coding Guidelines

1. **Read `TODO.md` first.** Work tasks in the listed order (they have dependencies).
2. **After completing and committing each task**, update `TODO.md` (mark done / remove) and
   add the task to `DONE.md`.
3. **Do not change any file not listed in `TODO.md`** unless fixing a compile/lint error
   directly caused by your changes.
4. **After editing each TypeScript file**, run `get_errors` on that file and fix any issues
   before moving on.
5. **Run the spec** after updating the spec file:
   `npx ng test --include='**/log-in/log-in.component.spec.ts' --watch=false --configuration test --browsers=ChromeHeadless`
6. **Commit message convention:**
   `feat: config-driven showPasswordLogin exclusive toggle (DEEPBLUE-466)`
7. The `config/config.yml` in this repo is **not** the demo config — do not modify it.
   The demo override happens via environment variable in the Kubernetes repo.
8. Do not remove the `<!--` comment block in `log-in.component.html` (lines 11–15) —
   it is intentionally left commented out.
9. **Always pass non-interactive flags to CLI tools** so commands never hang waiting for
   user input. Key flags for this repo:
   - `git`: use `git --no-pager <command>` (or pipe through `| cat`) for any command that
     may open a pager (`log`, `diff`, `show`, `blame`, etc.).
   - `ng test`: always include `--watch=false --browsers=ChromeHeadless` — without
     `--watch=false` the process never exits; without `--browsers=ChromeHeadless` it
     tries to launch a visible browser window.
   - Any other interactive tool (`less`, `man`, `top`, etc.): pipe through `| cat` or
     pass the equivalent "non-interactive / no-pager" flag before running.


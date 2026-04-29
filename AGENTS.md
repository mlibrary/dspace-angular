# AGENTS.md — Coding Agent Guidelines for `mlibrary/dspace-angular`

## Purpose

This file gives a coding agent everything it needs to work in the
`mlibrary/dspace-angular` repository without needing to ask the human for context.
It covers repo orientation, how to find and track work, general coding guidelines,
and reusable codebase patterns.

---

## Repository Overview

| Item | Value |
|---|---|
| Repo | `mlibrary/dspace-angular` |
| Primary branch | `umich` |
| Framework | Angular 14 / DSpace 7.6 |
| Language | TypeScript + HTML templates |
| Fork of | `DSpace/dspace-angular` (upstream) |

This is the University of Michigan customisation of the DSpace Angular frontend.
UM-specific changes live alongside standard DSpace code; prefer touching only the
files necessary for each task so merging upstream updates stays manageable.

---

## Finding and Tracking Work

1. **Read `TODO.md` first.** It lists all active work items in priority order.
2. **Read the relevant plan document** in `plans/` before touching any code.
   Each plan has background, rationale, exact code snippets, and verification steps.
3. **After completing and committing each task**, mark it done in `TODO.md` and add
   a summary entry to `DONE.md`.
4. Plan documents follow the naming convention `plans/PLAN_<FEATURE>.md`.
   Copy `plans/PLAN_TEMPLATE.md` to start a new plan.

---

## Coding Guidelines

1. **Do not change files outside the scope of the current task** unless fixing a
   compile/lint error directly caused by your own changes.

2. **After editing each TypeScript file**, run `get_errors` on that file and fix any
   issues before moving on.

3. **Run affected specs** after updating spec files:
   ```
   npx ng test --include='**/path/to/component.spec.ts' \
     --watch=false --configuration test --browsers=ChromeHeadless
   ```

4. **Commit message convention** — use the Angular commit format:
   ```
   <type>: <short summary> (<TICKET-ID>)
   ```
   Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`.

5. **Always pass non-interactive flags to CLI tools** so commands never hang:
   - `git`: use `git --no-pager <command>` (or pipe through `| cat`) for any command
     that may open a pager (`log`, `diff`, `show`, `blame`, etc.).
   - `ng test`: always include `--watch=false --browsers=ChromeHeadless`.
     Without `--watch=false` the process never exits; without `--browsers=ChromeHeadless`
     it tries to launch a visible browser window.
   - Any other interactive tool (`less`, `man`, `top`, etc.): pipe through `| cat` or
     pass the equivalent "non-interactive / no-pager" flag before running.

6. **Do not modify `config/config.yml`** — that file holds local dev overrides and is
   not committed. Environment-specific runtime config is injected via environment
   variables in Kubernetes (see plan documents for details).

---

## Reusable Codebase Patterns

### `APP_CONFIG` Injection Token

`APP_CONFIG` is an `InjectionToken<AppConfig>` defined in
`src/config/app-config.interface.ts`. Use it to read runtime config in components:

```typescript
import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface';
// Adjust the relative path depth to match your component's location.

constructor(
  // ...existing params...
  @Inject(APP_CONFIG) private appConfig: AppConfig
) {}
```

Provide it in tests with:
```typescript
import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
// ...
{ provide: APP_CONFIG, useValue: environment }
```

Existing injection examples to reference:
- `src/app/community-list-page/community-list-service.ts`
- `src/app/item-page/edit-item-page/virtual-metadata/virtual-metadata.component.ts`

### Adding a New Config Flag

1. Add `myFlag?: boolean` to the relevant interface in `src/config/`.
2. Set the default value in `src/config/default-app-config.ts`.
3. Document it as a commented-out entry in `config/config.example.yml`.
4. Read it in the component via `this.appConfig.section?.myFlag ?? defaultValue`.

The config system merges `DSPACE_*` environment variables at startup —
`DSPACE_AUTH_MYFLAG=true` maps to `auth.myFlag`. The env-var override works even
when the default is `false` because `isNotEmpty(false) === true`.

### Angular Testing with `CUSTOM_ELEMENTS_SCHEMA`

Many specs declare `CUSTOM_ELEMENTS_SCHEMA` to avoid registering every child component.
Key consequences:

- `By.css('ds-some-component')` returns elements, but `componentInstance` and
  `properties['input']` are **not** available — Angular never instantiates the class.
- `By.directive(SomeComponent)` **does** work when `SomeComponent` is declared (e.g.
  via `SharedModule`) — it finds real instantiated component objects.
- To inspect which auth method rendered in `LogInComponent`, query for the inner method
  component that `ngComponentOutlet` created:
  ```typescript
  By.directive(LogInPasswordComponent)           // password path
  By.directive(LogInExternalProviderComponent)   // OIDC/shibboleth path
  ```

### `TestBed.overrideProvider()` Limitation

`TestBed.overrideProvider()` throws *"Cannot override provider when the test module has
already been instantiated"* when called inside an `it()` or `beforeEach()` that runs
after `TestBed.createComponent()`. Calling `fixture.destroy()` first does **not** reset
module state.

Alternatives:
- Set the component property directly: `component.myFlag = true; fixture.detectChanges()`.
- Put `overrideProvider()` inside `beforeEach()` **before** `compileComponents()`, in a
  nested `describe` block that has its own `TestBed.configureTestingModule` call.

---

## Plans Index

| Plan file | Feature | Status |
|---|---|---|
| `plans/PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` | Config-driven `showPasswordLogin` toggle | ✅ Merged (PR #94) |

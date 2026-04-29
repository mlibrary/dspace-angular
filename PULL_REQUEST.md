# DEEPBLUE-466 — Config-driven password login toggle for demo environment

## Summary

Restores the password login form on the **demo** environment without changing
production or workshop behaviour.

A new `showPasswordLogin` config flag (default `false`) acts as an **exclusive toggle**:

| `showPasswordLogin` | Login UI | Environment |
|---|---|---|
| `false` (default) | OIDC button only | production, workshop — **no change** |
| `true` | Password form only | demo |

---

## Background

Deep Blue Documents has three Kubernetes environments: production, workshop, and demo.

**Demo** uses a two-layer auth model:
1. `oauth2-proxy` gate requires U-M WebLogin (Shibboleth OIDC) — restricts access to U-M people.
2. Inside the gate, users log in to DSpace with **username/password** to switch test personas.

DSpace's internal OIDC is intentionally disabled for demo so testers aren't auto-logged-in
as their own umich.edu identity. An existing UM customisation (`*ngIf="authMethod.authMethodType !== 'password'"`) removed the password form from the UI — which was fine when OIDC was the
active method but leaves a completely **blank login page** now that OIDC is disabled.

---

## Changes

### `src/config/auth-config.interfaces.ts`
Added `showPasswordLogin?: boolean` to `AuthConfig`.

### `src/config/default-app-config.ts`
Defaulted `showPasswordLogin: false` — all environments preserve current behaviour
unless they explicitly opt in.

### `src/app/shared/log-in/log-in.component.ts`
Injected `APP_CONFIG`; reads flag into `public showPasswordLogin: boolean`.

### `src/app/shared/log-in/log-in.component.html`
Replaced:
```html
*ngIf="authMethod.authMethodType !== 'password'"
```
with the exclusive toggle:
```html
*ngIf="showPasswordLogin === (authMethod.authMethodType === 'password')"
```

### `src/app/shared/log-in/log-in.component.spec.ts`
Provided `APP_CONFIG` token in `TestBed`; updated `toBe(2)` → `toBe(1)`.

### `config/config.example.yml`
Documented the new flag (commented out) in the `auth:` block for operators.

---

## Configuration

Enable for demo via frontend Kubernetes ConfigMap environment variable:
```
DSPACE_AUTH_SHOWPASSWORDLOGIN=true
```

The DSpace Angular config system translates this to a proper boolean `true`
via `getBooleanFromString` (verified). Production and workshop must NOT set
this variable — omitting it is sufficient.

> ⚠️ **This PR does not touch the Kubernetes config.** Setting the env-var
> in `mlibrary/deepblue-documents-kube` is a separate follow-up step.

---

## Also fixed in this PR

The `umich` base branch had 14 TypeScript compilation errors in 9 spec files
that prevented the test suite from starting at all. Fixed as part of this PR:

- `environment.test.ts` — missing `serverLocation` property required by `BuildConfig`
- `item-withdraw.component.spec.ts` / `item-reinstate.component.spec.ts` — `setWithDrawn` now requires a `reason` argument (TS2554)
- 6 bitstream-format spec files — `BitstreamFormatSupportLevel` enum values renamed: `Unknown → AS_IS_UNKNOWN`, `Known → AS_IS_KNOWN`, `Supported → HIGHEST_LEVEL`

---

## Testing

- ✅ Unit tests: `log-in.component.spec.ts` — 2 specs, 0 failures
- ✅ Config flow verified end-to-end: env-var → `buildAppConfig` → `extendEnvironmentWithAppConfig` → `APP_CONFIG` token → component → template
- ✅ `isNotEmpty(false) === true` confirmed — the env-var is **not** silently ignored when the default value is `false`

See `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` for full rationale, config system
deep-dive, on-host debugging commands, and post-deployment verification steps.

---

## Verification after demo deployment

1. Navigate to `https://demo.deepblue-documents.lib.umich.edu` — gate challenges for U-M WebLogin.
2. After passing the gate, click **Log In**.
3. A username/password form appears (no OIDC button). ✅
4. Log in as `dbrrds@umich.edu`. Confirm login succeeds. ✅
5. Log out; log in as the alternate demo persona (for example `tildon@umich.edu`) using credentials retrieved from the approved secret manager / restricted ops runbook referenced in `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` — confirm persona switching works. ✅

For **production/workshop**: login still shows only the OIDC button. No regression. ✅


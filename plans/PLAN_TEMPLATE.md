# Plan: <Feature Name>

**Repository:** `mlibrary/dspace-angular`
**Plan file:** `plans/PLAN_<FEATURE>.md`
**Branch:** `<branch-name>`
**Ticket:** `<TICKET-ID>`
**Status:** 🚧 In progress

---

## Problem

<!-- What is broken or missing? What environment is affected? -->

---

## Chosen Solution

<!-- Describe the approach chosen and why. If alternatives were considered, list them here. -->

---

## Key Files

| File | Change needed |
|---|---|
| `path/to/file.ts` | Description of change |

---

## Exact Code Changes

<!-- Paste the before/after snippets for each file so an agent can implement without guessing. -->

### `path/to/file.ts`

**Before:**
```typescript
// existing code
```

**After:**
```typescript
// new code
```

---

## Config / Environment Variables

<!-- If the feature is config-driven, document the flag name, default, and env-var override. -->

| Flag | Default | Env-var override | Notes |
|---|---|---|---|
| `section.flagName` | `false` | `DSPACE_SECTION_FLAGNAME=true` | Description |

---

## Truth Table

<!-- Optional: for boolean toggles, show all combinations and expected outcomes. -->

| Flag value | Behaviour |
|---|---|
| `false` (default) | … |
| `true` | … |

---

## Verification Steps

1. Build and start the app locally.
2. …
3. Confirm expected behaviour.

---

## Out-of-Band Tasks

<!-- Tasks in other repositories or infrastructure that must accompany this change. -->

- [ ] Set `ENV_VAR=value` in Kubernetes ConfigMap for `<environment>` (`mlibrary/deepblue-documents-kube`).


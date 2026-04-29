# clean-up — Generalize coding-agent markdown files

## Summary

Converts the `show-password-login`-specific agent-guidance files into
repo-wide, feature-agnostic tooling that can support multiple plans and
work items running in parallel.

No source code is changed. All commits are documentation only.

---

## Changes

### `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md` → `plans/PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md`
Moved the plan document into a new `plans/` directory so all per-feature
design documents live in one place. Updated the file's own header to reflect
its new path and merged status.

### `plans/PLAN_TEMPLATE.md` *(new)*
Blank plan template for future features. Sections: Problem, Chosen Solution,
Key Files, Exact Code Changes, Config / Environment Variables, Truth Table,
Verification Steps, Out-of-Band Tasks.

### `AGENTS.md`
Rewritten as repo-wide coding-agent guidelines. Removed all
`show-password-login`-specific content. Now contains:
- Repository overview (framework, language, conventions).
- How to find work (`TODO.md` → `plans/` document).
- Six general coding guidelines (non-interactive CLI flags, `get_errors`
  after every TS edit, commit message convention, `ng test` flags, etc.).
- Reusable codebase patterns: `APP_CONFIG` injection, adding a config flag,
  `CUSTOM_ELEMENTS_SCHEMA` behaviour, `TestBed.overrideProvider()` limitation.
- Plans index table (one row per feature).

### `TODO.md`
Rewritten to support multiple parallel work items. Each work item is a
top-level heading with its own subtask checklist and a reference to the
relevant plan document.

### `DONE.md`
Rewritten as a general feature archive. Each completed feature is a
top-level heading with its plan reference, branch, PR number, and a
concise summary of what was done.

---

## Why

The previous files were written during the `show-password-login` sprint and
were tightly coupled to that feature. As the next feature work starts, a
coding agent that reads `AGENTS.md` / `TODO.md` would be confused by
feature-specific instructions. This PR makes the system self-consistent and
ready for the next task.

# TODO — mlibrary/dspace-angular

Tasks are listed in dependency order within each work item.
Complete subtasks top-to-bottom, then move the finished task to `DONE.md`.

Multiple work items may be in progress in parallel; each is tracked under its own heading.

---

## Task A — Generalize coding-agent markdown files

**Branch:** `clean-up`
**Goal:** Replace the `show-password-login`-specific agent files (`AGENTS.md`, `TODO.md`,
`DONE.md`) with general-purpose equivalents that can track multiple plans and work items
in parallel, and move plan documents into a dedicated `plans/` directory.

### Subtasks (in order)

- [ ] **A1. Create `plans/` directory** — move `PLAN_DSPACE_ANGULAR_PASSWORD_LOGIN.md`
      into `plans/` so all per-feature design documents live in one place.
      Update any cross-references inside the file to reflect its new path.

- [ ] **A2. Rewrite `AGENTS.md`** — strip out all `show-password-login`-specific content
      and replace with repo-wide guidance:
      - Repository overview (framework, language, conventions).
      - How to find work: read `TODO.md`, read the relevant `plans/` document.
      - General coding guidelines (currently guideline 9 about non-interactive CLI flags —
        keep and expand as the canonical list for all agents).
      - Reusable codebase patterns worth knowing (e.g. `APP_CONFIG` injection, Angular
        testing patterns, `By.directive` vs `CUSTOM_ELEMENTS_SCHEMA`).
      - Remove all references to a specific branch, ticket, or feature.

- [ ] **A3. Rewrite `TODO.md`** (this file) — convert to the general format illustrated
      here: tasks grouped by work item, each referencing its plan document, no hardcoded
      branch or feature names in the file header.

- [ ] **A4. Rewrite `DONE.md`** — convert to a general archive grouped by work item /
      feature, each group headed by the feature name and merged-PR reference rather than
      a flat chronological list tied to `show-password-login`.

- [ ] **A5. Add a `plans/PLAN_TEMPLATE.md`** — a blank plan template that a human or
      agent can copy when starting a new feature, with sections for: Problem, Chosen
      Solution, Key Files, Truth Table / Example Config, Verification Steps.

- [ ] **A6. Commit all changes** on `clean-up` and open a PR against `umich`.

---

## Task 9 — Kubernetes demo config (out-of-band — different repository)

This task is tracked here for completeness; it is performed in `mlibrary/deepblue-documents-kube`,
not in this repo.

- [ ] Add `DSPACE_AUTH_SHOWPASSWORDLOGIN=true` to the **frontend** demo Deployment/ConfigMap
      in `environments/deepblue-documents/demo/`.
- [ ] Confirm production and workshop frontend ConfigMaps do **not** set this variable
      (they default to `false`).

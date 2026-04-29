# TODO — show-password-login implementation

Tasks are listed in dependency order. Complete them top-to-bottom.
Move each task to `DONE.md` when it is committed to the `show-password-login` branch.

---

## 9. Note in Kubernetes repo (out-of-band — different repository)

This task is tracked here for completeness; it is performed in `mlibrary/deepblue-documents-kube`,
not in this repo.

- [ ] Add `DSPACE_AUTH_SHOWPASSWORDLOGIN=true` to the **frontend** demo Deployment/ConfigMap
      in `environments/deepblue-documents/demo/`.
- [ ] Confirm production and workshop frontend ConfigMaps do **not** set this variable
      (they default to `false`).

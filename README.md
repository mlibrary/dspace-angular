# [Deep Blue Documents](https://deepblue.lib.umich.edu/)
See also: [https://github.com/mlibrary/DSpace](https://github.com/mlibrary/DSpace) and [https://github.com/mlibrary/deepblue-documents-kube](https://github.com/mlibrary/deepblue-documents-kube) (private)
## [DSpace](https://dspace.lyrasis.org/) - [Angular](https://angular.dev/) frontend.
GitHub Actions [workflows](https://github.com/mlibrary/dspace-angular/actions) to produce Docker [images](https://github.com/orgs/mlibrary/packages?repo_name=dspace-angular) of Angular frontend.

| Dockerfile          | Image           | Description                                 |
|---------------------|-----------------|---------------------------------------------|
| frontend.dockerfile | dspace-frontend | Angular frontend for DSpace backend service |

## Building and running locally
The `compose.yml` file is configured for local development and testing.
```shell
docker compose up -d
```

### Frontend URLs
| URL                                     | Container | Comments                                     |
|-----------------------------------------|-----------|----------------------------------------------|
| http://localhost:4000/                  | frontend  | Angular GUI (SSR app shell; Angular router handles `/home` etc. client-side) |

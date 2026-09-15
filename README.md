# Deep Blue Documents Frontend Service

[Deep Blue Documents](https://deepblue.lib.umich.edu/) is the University of Michigan's institutional repository for scholarly works.

This repository contains the Angular frontend service. Backend services are in the [mlibrary/DSpace](https://github.com/mlibrary/DSpace) repository.


## Workflow to build GitHub Package 
| Workflow          | Package           | Description                                 |
|---------------------|-----------------|---------------------------------------------|
| Build dpsace-frontend image | dspace-frontend | Angular frontend for DSpace backend service |

## Local Production Sandbox
Using Docker Compose, you can build and run the frontend service locally to simulate a production environment. The frontend service is configured to use the local production backend service (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace) Local Production Sandbox).

```shell
docker compose up -d
```

### Service Endpoint
| URL                                     | Container | Comments                                     |
|-----------------------------------------|-----------|----------------------------------------------|
| http://localhost:4000/documents                  | frontend  | Angular GUI (SSR app shell; Angular router client-side) |

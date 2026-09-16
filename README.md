# Deep Blue Documents Frontend Service

[Deep Blue Documents](https://deepblue.lib.umich.edu/documents) is the University of Michigan's institutional repository for scholarly works.

This repository contains the frontend service: DSpace Angular.

The backend services are in the [mlibrary/DSpace](https://github.com/mlibrary/DSpace) repository.


## Workflow to build GitHub Package 
| Workflow          | Package           | Description                                 |
|---------------------|-----------------|---------------------------------------------|
| Build dpsace-frontend image | dspace-frontend | Angular frontend for DSpace backend service |

## Local Production Sandbox
Using Docker Compose, you can build and run the frontend service locally to simulate a production environment.

```shell
docker compose up -d
```
Once you have the local production backend services up and running (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)) and made yourself an admin user, you can log in http://localhost:4000/login to the frontend service **


You'll get a 500 error if you don't have any collections and documents, so navigate to the search page http://localhost:4000/search (you may need to log in again) and create a collection and add a document.

** If you don't see a login form, you may need to clear your browser cache 
and refresh the page or try a different browser. I had experienced this issue when using DuckDuckGo and switched to Chrome. My best guess is DuckDuckGo is blocking pop-ups 
or cookies. Still having an issue the [notes](#notes) below may help, good luck!

### Service Endpoint
| URL                                     | Container | Comments                                     |
|-----------------------------------------|-----------|----------------------------------------------|
| http://localhost:4000/documents                  | frontend  | Angular GUI (SSR app shell; Angular router client-side) |

### NOTES
- The frontend service is configured to use the local production backend services (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)).
- If the behavior of the frontend service is not as expected and the backend services are running and healthy...
- - check the frontend service logs for any errors or issues.
- - check the browser console for any errors or issues.
- - try refreshing the page or clearing the browser cache.
- - check the backend services logs for any errors or issues.

## Development

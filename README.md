# Deep Blue Documents Frontend Service

[Deep Blue Documents](https://deepblue.lib.umich.edu/documents) is the University of Michigan's institutional repository for scholarly works.

This repository contains the frontend service: DSpace Angular.

The backend services are in the [mlibrary/DSpace](https://github.com/mlibrary/DSpace) repository.


## Workflow to build GitHub Package 
| Workflow          | Package           | Description                                 |
|---------------------|-----------------|---------------------------------------------|
| Build dpsace-frontend image | dspace-frontend | Angular frontend for DSpace backend service |

## Local Production Sandbox
### Docker Compose
Using Docker Compose, you can build and run the frontend service locally to simulate a production environment.

```shell
docker compose up -d
```
### Service Endpoint
| URL                                     | Container | Comments                                     |
|-----------------------------------------|-----------|----------------------------------------------|
| http://localhost:4000/documents                  | frontend  | Angular GUI (SSR app shell; Angular router client-side) |

### Log In
Once you have the local production backend services up and running (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)) and made yourself an admin user, you can log in http://localhost:4000/login via the frontend service **


You'll get a 500 error if you don't have any communities, collections, and documents, so navigate to the search page http://localhost:4000/search (you may need to log in again) and create a community, a collection, and add a document.

#### ** If you don't see a login form ...
- You may need to clear your browser cache and refresh the page
- Allow pop-ups, basically the login form is a pop-up, although it doesn't look like a traditional one visually
- Try a different browser
- Environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' in the compose.yml file
- - Uncommented out if you are using the default DSpace login form.
- - Commented out if you are using OIDC login. 

#### The backend service in the [mlibrary/DSpace](https://github.com/mlibrary/DSpace) compose.yml determines which login type is used:
```
  # Disable OIDC authentication for local dev; use password auth only.
  # NOTE: Setting the frontend environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' is required to show the password login form in the Angular UI.
  - plugin__P__sequence__P__org__P__dspace__P__authenticate__P__AuthenticationMethod=org.dspace.authenticate.PasswordAuthentication
  # Enable OIDC authentication for local dev; use institutional SSO only.
  # NOTE: NOT setting the frontend environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' is required to show the OIDC login form in the Angular UI.
#  - plugin__P__sequence__P__org__P__dspace__P__authenticate__P__AuthenticationMethod=org.dspace.authenticate.OidcAuthentication
```

### Notes
- The frontend service is configured to use the local backend services (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)).
- If the behavior of the frontend service is not as expected and the backend services are running and healthy...
- - check the frontend service logs for any errors or issues.
- - check the browser console for any errors or issues.
- - try refreshing the page or clearing the browser cache.
- - check the backend services logs for any errors or issues.

## Local Development

### Ensure the [Local Production Sandbox](local-production-sandbox) is not running so the http://localhost:4000 port is available.
```shell
docker compose down
```
### Set up your local development tools.
```shell
mise trust
mise install
```
### Install the local dependencies.
```shell
yarn install
```
### Production Mode
#### Create `./config/config.prod.yml` 
```yaml
rest:
  ssl: false
  host: localhost
  port: 8080
```
#### Start the frontend service in production mode.
```shell
yarn start
```
#### [log in](#log-in)
### Development Mode
#### Create `./config/config.dev.yml` 
```yaml
rest:
  ssl: false
  host: localhost
  port: 8080
```
#### Start the frontend service in development mode.
```shell
yarn start:dev
```
#### [log in](#log-in)
### Backend Services
The frontend service will connect to the local backend services (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)).
### Additional Information

For additional information see [DSpace README](DSPACE_README.md) (the original upstream README)

## WebStorm IDE Development

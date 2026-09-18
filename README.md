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
docker compose up
```
### Service Endpoint
| URL                                     | Container | Comments                                     |
|-----------------------------------------|-----------|----------------------------------------------|
| http://localhost:4000/documents                  | frontend  | Angular GUI (SSR app shell; Angular router client-side) |

### Log In
Once you have the local backend services up and running (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)) and made yourself an admin user, you can log in http://localhost:4000/login.


You'll get a 500 error if you don't have any communities, collections, and documents, so navigate to the search page http://localhost:4000/search (you may need to log in again) and create a community, a collection, and add a document.

**If you don't see a login form ...**
- You may need to clear your browser cache and refresh the page
- Allow pop-ups, basically the login form is a pop-up, although it doesn't look like a traditional one visually
- Try a different browser
- Environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' in the compose.yml file
- - Uncommented out if you are using the default DSpace login form.
- - Commented out if you are using OIDC login. 

**The configuration of the `backend` service determines which login type is used.**
```
  # Disable OIDC authentication for local dev; use password auth only.
  # NOTE: Setting the frontend environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' is required to show the password login form in the Angular UI.
  - plugin__P__sequence__P__org__P__dspace__P__authenticate__P__AuthenticationMethod=org.dspace.authenticate.PasswordAuthentication
  # Enable OIDC authentication for local dev; use institutional SSO only.
  # NOTE: NOT setting the frontend environment variable DSPACE_AUTH_SHOWPASSWORDLOGIN: 'true' is required to show the OIDC login form in the Angular UI.
#  - plugin__P__sequence__P__org__P__dspace__P__authenticate__P__AuthenticationMethod=org.dspace.authenticate.OidcAuthentication
```
**Excerpted from the `backend` service environment in the [docker-compose.yml](https://github.com/mlibrary/DSpace/blob/7587c55320c3c77b3eade82011bed391ab41fddc/compose.yml#L28) file.**
### Notes
- The frontend service is configured to use the local backend services (see [mlibrary/DSpace](https://github.com/mlibrary/DSpace)#[Local Production Sandbox](https://github.com/mlibrary/DSpace#local-production-sandbox)).
- If the behavior of the frontend service is not as expected and the backend services are running and healthy...
- - check the frontend service logs for any errors or issues.
- - check the browser console for any errors or issues.
- - try refreshing the page or clearing the browser cache.
- - check the backend services logs for any errors or issues.

### Additional Information
For more information see [README2](README2.md) (the original upstream README) and agent responses to questions in the READMETOO directory (feel free to contribute additional agent responses).

## Local Development

Ensure the [Local Production Sandbox](local-production-sandbox) is not running to free up the port for local development.
```shell
docker compose down
```
Set up your local development tools.
```shell
mise trust
mise install
```
Install the local dependencies.
```shell
yarn install
```
### Production Mode
Create `./config/config.prod.yml` with the following content.
```yaml
rest:
  ssl: false
  host: localhost
  port: 8080
auth:
  showPasswordLogin: true
```
**If you are using OIDC login, set `showPasswordLogin: false` in the config.prod.yml file.**

Start the frontend service in production mode.
```shell
yarn start
```
#### [log in](#log-in)
### Development Mode
Create `./config/config.dev.yml` with the following content.
```yaml
rest:
  ssl: false
  host: localhost
  port: 8080
auth:
  showPasswordLogin: true
```
**If you are using OIDC login, set `showPasswordLogin: false` in the config.dev.yml file.**

Start the frontend service in development mode.
```shell
yarn start:dev
```
#### [log in](#log-in)

## WebStorm Debugging
To debug the `dspace-angular` application in WebStorm, you can debug **client-side Angular code in the browser**, **server-side Node/SSR scripts**, or **unit tests (Karma)** directly with WebStorm breakpoints. 

See the following agent-generated markdown files for more information:
- [WEBSTORM.md](READMETOO/WEBSTORM.md)
- [WEBSTORM_DEBUG.md](READMETOO/WEBSTORM_DEBUG.md)
- [WEBSTORM_MISE.md](READMETOO/WEBSTORM_MISE.md)

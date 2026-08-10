# UM DEV

## Clone

```
git clone https://github.com/mlibrary/dspace-angular.git
cd dspace-angular
git checkout umich
```

## Create config/config.development.yaml

```
rest:
  ssl: false
  host: localhost
  port: 8080
  nameSpace: /server
```

NOTE: The S in `nameSpace` is uppercase to avoid name collision with ts???

## Development
### clean up brew
```
brew uninstall yarn
brew uninstall node --ignore-dependencies
```

### switch to fnm (Fast Node Manager)

```
brew update
brew upgrade
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
fnm install 18
corepack enable
```

### run development server

```
yarn install
yarn run start:dev
```


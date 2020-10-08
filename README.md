# het-frontend

The frontend codebase for [Health Equity Tracker](https://healthequitytracker.org/).

## Developer Instructions 

### Install

Change directories to the `app/` directory, then install dependencies using NPM.  

_Note: you will need a compatible verison of Node.JS and NPM installed locally. See the "engines" field in `app/package.json` for the required / minimum versions of each. It's recommended to use [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm) if you need to have multiple versions of Node.JS / NPM installed on your machine._

```bash
cd app && npm install
```

### Develop

To start a local web server and watch for changes, from the `app/` directory do:

```bash
npm start
```

The site should now be visible at `localhost:3000`. Any changes to source code will cause a live reload of the site.

### Tests

To run unit tests, from the `app/` directory do:

```bash
npm run test
```

This will run tests in watch mode, so you may have the tests running while developing.

### Build

To create a "production" build, from the `app/` directory do:

```bash
npm run build
```

This should output bundled files in the `app/build/` directory. Use these files for hosting the web app.

## License
MIT
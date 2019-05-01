[![npm](https://img.shields.io/npm/v/coppa.svg)](http://npm.im/coppa)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)

# 🏇 Coppa

> Lightweight CLI tool for local developement of serverless Google Cloud Functions

Coppa was made for developers working with google cloud serverless functions. Coppa creates a local dev server that mimicks deployed cloud functions.

Coppa is different from [Google Cloud Functions NodeJS Emulator](https://cloud.google.com/functions/docs/emulator) because it does not require devs to deploy each function locally. Coppa just reads your yaml file and your main index file and spins up a quick dev server for easy and painless debugging and development.

Coppa even provides a free documentation page auto generated based on your functions, by leveraging the npm package [quantor](https://www.npmjs.com/package/quantor).

## Install

This is a CLI tool so it's best to install globally for convenience.

Yarn:

```sh
yarn global add coppa
```

NPM:

```sh
npm i -g coppa
```

## Usage

`cd` into your app directory that contains your `serverless.yml` file and your main `index.js` file that holds all your cloud functions, then run:

```sh
coppa start
```

This command will start the dev server using the default arguments for locating files, which is `./serverless.yml` for the serverless yaml, and `./index.js` for the main entry point.

These can be changed by passing in flags to Coppa. To see all the flags, run:

```sh
coppa start --help
```

To use any flag, include it in the command:

```sh
coppa start -c path/to/serverless.yml -p 9001
```

## Flags

Here are all the available flags for the `start` command.

- `-c, --config [path]` Path to serverless config file (default: ./serverless.yml)
- `-e, --entry [path]` Path to JS entry point file (default: ./index.js)
- `-s, --stage [stage]` Stage to be used
- `-p, --port [port]` Port for server to use (default: 8080)
[![npm](https://img.shields.io/npm/v/coppa.svg)](http://npm.im/coppa)

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

- `cd` into your app directory that contains your `serverless.yml` file and your main `index.js` file that holds all your cloud functions.
- In this directory, execute `coppa start` in the command line to start the dev server. It will default to reading the `serverless.yml` file in the current working directory or you can point to your own with the `-c` flag `coppa start -c src/serverless.yml`

## Flags

Here are all the available flags. Can also be viewed in your command line by typing `coppa --help`

- `-c, --config [path]` Path to serverless config file (default: ./serverless.yml)
- `-e, --entry [path]` Path to JS entry point file (default: ./index.js)
- `-s, --stage [stage]` Stage to be used
- `-p, --port [port]` Port for server to use (default: 8080)
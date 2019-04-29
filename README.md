[![npm](https://img.shields.io/npm/v/coppa.svg)](http://npm.im/coppa)

# 🏇 Coppa

> Lightweight CLI tool for local developement of serverless Google Cloud Functions

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
- In this directory, execute `coppa` in the command line to start the dev server. It will default to reading the `serverless.yml` file in the current working directory or you can point to your own with the `-c` flag `coppa -c src/serverless.yml`

## Flags

Here are all the available flags. Can also be viewed in your command line by typing `coppa --help`

*Coming soon...*
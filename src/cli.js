#!/usr/bin/env node

const fs = require('fs')
const cors = require('cors')
const path = require('path')
const program = require('commander')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const yaml = require('js-yaml')
const quantor = require('quantor')
const { Ok, Err, encaseRes } = require('pratica')

const readServerlessYaml = (filePath, stage) =>
  encaseRes(() => yaml.safeLoad(fs.readFileSync(filePath, 'utf8')))
    .mapErr(() => `Error reading yaml file: ${filePath}`)
    .chain(yml => yml.functions ? Ok(yml) : Err(`No functions declared in yaml file: ${config}`))
    .map(({ functions, service }) => Object.keys(functions).map(key => ({
      name: stage ? `/${service}-${stage}-${key}` : `/${service}-${key}`,
      display: functions[key].name,
      description: functions[key].description,
      handler: functions[key].handler
    })))

const readFunctionsJs = filePath =>
  encaseRes(() => require(path.resolve(filePath)))
    .mapErr(() => `Could not read main functions module: ${filePath}`)

const sanitizeFuncs = ({ handlers, funcsMod }) => handlers
  .map(({ name, display, description, handler }) => ({ name, display, description, handler: funcsMod[handler] }))
  .filter(({ handler }) => !!handler)

const createServer = port => funcs => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(morgan('dev'))
  app.use(cors())

  funcs.map(({ name, handler }) => console.log(name) || app.all(name, handler))

  app.get('/', (req, res) => quantor({
    title: 'Coppa Server',
    endpoints: funcs.map(({ name, display, description }) => ({
      name,
      description: description || 'No description provided...',
      display: display || 'No name provided...',
      handlers: { GET: {}, POST: {}, PUT: {}, DELETE: {} }
    }))
  })(html => res.send(html)))

  app.listen(port, () => console.log(`Coppa listening on port ${port}!`))
}

const start = opts => {
  const port = opts.port || 8080
  const config = opts.config || './serverless.yml'
  const entry = opts.entry || './index.js'
  const stage = opts.stage

  readServerlessYaml(config, stage)
    .chain(handlers => readFunctionsJs(entry).map(funcsMod => ({ handlers, funcsMod })))
    .map(sanitizeFuncs)
    .cata({
      Ok: createServer(port),
      Err: msg => {
        console.error(msg)
        process.exit(1)
      }
    })
}

// --- CLI PROGRAM --- //

program.version('1.0.0')

program
  .command('start')
  .description('Start the Coppa dev server')
  .option('-c, --config [path]', 'Path to serverless config file (default: ./serverless.yml)')
  .option('-e, --entry [path]', 'Path to JS entry point file (default: ./index.js)')
  .option('-s, --stage [stage]', 'Stage to be used')
  .option('-p, --port [port]', 'Port for server to use (default: 8080)')
  .action(start)

program.parse(process.argv)
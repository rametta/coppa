#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const yaml = require('js-yaml')
const { Ok, Err, encaseRes } = require('pratica')

// readServerlessYaml :: String -> Result
const readServerlessYaml = path =>
  encaseRes(() => yaml.safeLoad(fs.readFileSync(path, 'utf8')))
    .mapErr(() => `Error reading yaml file: ${path}`)
    .chain(yml => yml.functions ? Ok(yml.functions) : Err(`No functions declared in yaml file: ${config}`))
    .map(funcsMap => Object.keys(funcsMap).map(key => ({ name: `/${key}`, handler: funcsMap[key].handler })))

// readFunctionsJs :: String -> Result
const readFunctionsJs = path =>
  encaseRes(() => require(path))
    .mapErr(() => `Could not read main functions module: ${path}`)

// sanitizeFuncs :: Handler -> Func[]
const sanitizeFuncs = ({ handlers, funcsMod }) => handlers
  .map(({ name, handler }) => ({ name, handler: funcsMod[handler] }))
  .filter(({ handler }) => !!handler)

// createHome :: (ExpressApp, Func[]) -> IO
const createHome = (app, funcs) =>
  app.get('/', (req, res) => res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Coppa</title>
      </head>
      <body>
        <ul>
          ${funcs.map(({ name }) => `<li><a href="${name}">${name}</a></li>`).join('')}
        </ul>
      </body>
    </html>
  `))

// createServer :: Number -> Func[] -> IO
const createServer = port => funcs => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(morgan('dev'))
  funcs.map(({ name, handler }) => console.log(name) || app.all(name, handler))
  createHome(app, funcs)
  app.listen(port, () => console.log(`Coppa listening on port ${port}!`))
}

// start :: Options -> IO
const start = opts => {
  const port = opts.port || 8080
  const config = opts.config || './serverless.yml'
  const entry = opts.entry || './index.js'
  const stage = opts.stage

  readServerlessYaml(config)
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
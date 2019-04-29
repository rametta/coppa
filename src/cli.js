#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const express = require('express')
const morgan = require('morgan')
const yaml = require('yaml')
const bodyParser = require('body-parser')
const pratica = require('pratica')

program
  .version('1.0.0')
  .option('-c, --config [path]', 'Path to serverless config file')
  .option('-e, --entry [path]', 'Path to JS entry point file')
  .option('-s, --stage [stage]', 'Stage to be used')
  .option('-p, --port [port]', 'Port for server to use (default: 8080)')
  .parse(process.argv)

const port = program.port || 8080
const config = program.config || 'serverless.yml'
const entry = program.entry || 'index.js'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('Hello World'))
app.listen(port, () => console.log(`Coppa listening on port ${port}!`))
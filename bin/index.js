#! /usr/bin/env node
const { StorageMonitoring } = require('./utils');
const fs = require('fs');
const yargs = require('yargs');
const storage = StorageMonitoring;

if(yargs.argv._[0] == 'init') {
  storage.startClean(process.cwd());
}
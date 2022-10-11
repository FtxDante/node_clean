#! /usr/bin/env node
const { StorageMonitoring } = require('./utils');
const yargs = require('yargs');
const storage = StorageMonitoring;

const usage = `\nUsage:
              
            npmcls evanesco      delete all node_modules in current directory`;

const options = yargs
  .usage(usage)
  .option('f', {
    alias: 'find',
    describe: 'Find all node_modules in current directory.',
    type: 'boolean',
    demandOption: false,
  })
  .option('n', {
    alias: 'now',
    describe: 'Delete all node_modules in current directory.',
    type: 'boolean',
    demandOption: false,
  })
  .help(true).argv;

if(yargs.argv.f || yargs.argv.find) {
  const archives = storage.readdir(process.cwd());
  storage.findNodeModules(archives);
  if(storage.nodeModulesFound.length === 0) {
    console.log('Was not found any node_modules')
    return;
  }

  storage.nodeModulesFound.forEach(pathToNodeModules => {
    console.log(pathToNodeModules + '/' + storage.target);
  })
}

if (!yargs.argv._[0]) {
  (async () => {
    console.log(await yargs.getHelp())
  })()
  return
}

if (yargs.argv.n || yargs.argv.node_modules || yargs.argv._[0] === 'evanesco') {
  storage.startClean(process.cwd());
  return
}
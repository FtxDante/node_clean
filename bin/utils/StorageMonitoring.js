const fs = require('fs');
const MeasureDirectory = require('./MeasureDirectory');

class StorageMonitoring {
  constructor() {
    this.sizeInMB = 0;
    this.sizeInGB = 0;
    this.counter = 0;
    this.nodeModulesFound = [];
  }

  readdir(dirname = __dirname) {
    return fs.readdirSync(dirname);
  }

  rm() {
    this.nodeModulesFound.forEach((path) => {
      fs.rmSync(path + '/node_modules', { force: true, recursive: true });
      this.saveStatus(MeasureDirectory.measure(path));
      console.log('\x1b[31m', `--> Deleted with successful, path: ${path}`);
    });
  }

  saveStatus({ sizeInMB, sizeInGB }) {
    this.sizeInMB += sizeInMB;
    this.sizeInGB += sizeInGB;
    this.counter++;
  }

  printStatus() {
    console.log('\x1b[32m', `Was deleted ${this.counter} node_modules`);
    this.sizeInGB > 1
      ? console.log('\x1b[32m', `Was deleted ${this.sizeInGB} GB`)
      : console.log('\x1b[32m', `Was deleted ${this.sizeInMB} MB`);
    console.log('--------------------------------------------------------------------------');
  }

  startClean(pathToRead) {
    console.log('I am starting to clean all node_modules, please wait!');
    const archives = this.readdir(pathToRead);
    this.findNodeModules(archives);
    this.rm();
    console.log('A quantidade de node_modules encontrada:', this.nodeModulesFound.length)

    if (this.sizeInMB === 0) {
      console.log('No node_modules was found');
    }
  }

  findNodeModules(archives = [], rootDir = '.') {
    const counterNow = this.counter;
    if (counterNow < this.counter) this.printStatus();

    archives.forEach(async (file) => {
      const nextArchive = `${rootDir}/${file}`;
      try {
        const insideArchive = this.readdir(nextArchive);
        if (insideArchive.includes('node_modules')) {
          this.nodeModulesFound.push(nextArchive);
          return;
        } else {
          this.findNodeModules(insideArchive, nextArchive);
        }
      } catch (err) {
        if (!err.message.includes('ENOTDIR: not a directory')) {
          console.log(err.message);
        }
      }
    });
  }
}

module.exports = StorageMonitoring;

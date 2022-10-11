const fs = require('fs');
const MeasureDirectory = require('./MeasureDirectory');

class StorageMonitoring {
  sizeInMB = 0;
  sizeInGB = 0;
  counter = 0;

  readdir(dirname = __dirname) {
    return fs.readdirSync(dirname);
  }

  rm(path) {
    fs.rmSync(path, { force: true, recursive: true });
    console.log('\x1b[31m', `--> Deleted with successful, path: ${path}`);
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
    const archives = this.readdir(pathToRead);
    const result = this.findNodeModules(archives);
    if (result.sizeInMB === 0) {
      console.log('No node_modules was found');
    }
  }

  findNodeModules(archives = [], rootdir = '.') {
    const counterNow = this.counter;
    if (counterNow != this.counter) this.printStatus();

    archives.forEach(async (file) => {
      const nextArchive = `${rootdir}/${file}`;
      try {
        const insideArchive = this.readdir(nextArchive);
        if (insideArchive.includes('node_modules')) {
          const pathToNodeModules = `${nextArchive}/node_modules`;
          console.log('I am deleting a node_modules, please wait!');
          this.rm(pathToNodeModules);
          this.saveStatus(MeasureDirectory.measure(nextArchive));
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

    return {
      sizeInMB: this.sizeInMB,
      sizeInGB: this.sizeInGB,
      counter: this.counter,
    };
  }
}

module.exports = StorageMonitoring;

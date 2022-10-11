const fs = require('fs');
const MeasureDirectory = require('./MeasureDirectory');
const rdl = require('readline');

class StorageMonitoring {
  constructor() {
    this.size = 50;
    this.sizeInMB = 0;
    this.sizeInGB = 0;
    this.counter = 0;
    this.cursor = 0;
    this.target = 'node_modules';
    this.timer;
    this.nodeModulesFound = [];
    this.nodeModulesRemoved = [];
  }

  loadingCLI() {
    const valueOfOneItem = ((1 / this.nodeModulesFound.length) / 2) * 100;

    process.stdout.write('\x1B[?25l');
    for (let i = 0; i < this.size; i++) {
      process.stdout.write('\u2591');
    }
    rdl.cursorTo(process.stdout, 0);
    this.timer = setInterval(() => {
      for (let i = 0; i < valueOfOneItem; i++) {
        process.stdout.write('\u2588');
        this.cursor++;
      }
      if (this.cursor >= this.size) {
        clearTimeout(this.timer);
      }
    }, 100);
  }

  readdir(dirname = __dirname) {
    return fs.readdirSync(dirname);
  }

  rm() {
    if(this.nodeModulesFound.length <= 0) {
      return;
    }

     this.nodeModulesFound.forEach((path) => {
       const pathToNodeModules = path + '/' + this.target;
       fs.rmSync(pathToNodeModules, { force: true, recursive: true });
       this.saveStatus(MeasureDirectory.measure(path));
       this.nodeModulesRemoved.push(pathToNodeModules);
     });

     this.loadingCLI();
  }

  saveStatus({ sizeInMB, sizeInGB }) {
    this.sizeInMB += sizeInMB;
    this.sizeInGB += sizeInGB;
    this.counter++;
  }

  startClean(pathToRead) {
    console.log('I am starting to clean all node_modules, please wait!');
    const archives = this.readdir(pathToRead);
    this.findNodeModules(archives);
    if (this.nodeModulesFound.length === 0) {
      console.log('None node_modules was found');
      return;
    }
    this.rm();
  }

  findNodeModules(archives = [], rootDir = '.') {
    archives.forEach(async (file) => {
      const nextArchive = `${rootDir}/${file}`;
      try {
        const insideArchive = this.readdir(nextArchive);
        if (insideArchive.includes(this.target)) {
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

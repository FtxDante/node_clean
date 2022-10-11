var fs = require('fs');
class MeasureDirectory {
  static sizeInMB = 0;
  static sizeInGB = 0;
  static readdir(dirname) {
    return fs.readdirSync(dirname);
  }

  static getSizes(stats) {
    var fileSizeInMegabytes = stats.size / (1024 * 1024);
    var fileSizeInGigaByte = fileSizeInMegabytes / 1024;
    this.sizeInMB += fileSizeInMegabytes;
    this.sizeInGB += fileSizeInGigaByte;

  }

  static measure(rootDir) {
    const archives = fs.readdirSync(rootDir);
    archives.forEach(async (file) => {
      const nextArchive = `${rootDir}/${file}`;
      try {
        const stats = fs.statSync(nextArchive);
        if (stats.isDirectory()) {
          this.measure(nextArchive);
        } else if (stats.isFile()) {
          this.getSizes(stats);
          return;
        } else {
        }
      } catch (err) {
        if (!err.message.includes('ENOTDIR: not a directory')) {
          console.log(err.message);
        }
      }
    });
    return { sizeInMB: this.sizeInMB, sizeInGB: this.sizeInGB };
  }
}
module.exports = MeasureDirectory;
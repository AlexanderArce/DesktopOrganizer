const path = require("path");
const fs = require("fs");
const os = require("os");
const { getDesktopFolder } = require("platform-folders");

const utils = require("./utils");

module.exports = {
  watchFolder: directory => {
    const directoryPath = directory
      ? path.join(os.homedir(), directory)
      : getDesktopFolder();
    // Watchs the directory for changes
    fs.watch(directoryPath, function(eventType, file) {
      const fileDirectory = path.join(directoryPath, file);
      const fileExtension = path.extname(file);
      // Checks if file exists
      fs.access(fileDirectory, fs.F_OK, err => {
        if (err) {
          return;
        }
        // Gets stats from file
        fs.stat(fileDirectory, (err, stats) => {
          if (err) {
            return;
          }
          utils.sortFiles(fileExtension, stats.birthtime, file, fileDirectory);
        });
      });
    });
  }
};

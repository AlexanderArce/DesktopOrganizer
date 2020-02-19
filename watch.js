const path = require("path");
const fs = require("fs");
const os = require("os");
const utils = require("./utils");
const args = process.argv.slice(2);
// Gets first argument as directory name, if not specified default to Desktop
const directoryPath = path.join(os.homedir(), args[0] || "Desktop");

// Reads the directory and searches for files
fs.watch(directoryPath, function(eventType, file) {
  const fileDirectory = path.join(directoryPath, file);
  const fileExtension = path.extname(file);
  // Gets stats from file
  fs.access(fileDirectory, fs.F_OK, err => {
    if (err) {
      return;
    }
    fs.stat(fileDirectory, (err, stats) => {
      if (err) {
        return;
      }
      utils.sortFiles(fileExtension, stats.birthtime, file, fileDirectory);
    });
  });
});

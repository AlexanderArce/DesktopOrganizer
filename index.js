const path = require("path");
const fs = require("fs");
const { getDesktopFolder } = require("platform-folders");

const utils = require("./utils");
const args = process.argv.slice(2);
// Gets first argument as directory name, if not specified default to Desktop
const directoryPath = path.join(getDesktopFolder(), args[0] || "Desktop");

// Reads the directory and searches for files
fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.error(`Unable to scan directory: ${directoryPath}`);
  }
  files.forEach(function(file) {
    // Gets stats from file
    const fileDirectory = path.join(directoryPath, file);
    const fileExtension = path.extname(file);
    fs.stat(fileDirectory, (err, stats) => {
      if (err) {
        return console.error(err);
      }
      utils.sortFiles(fileExtension, stats.birthtime, file, fileDirectory);
    });
  });
});

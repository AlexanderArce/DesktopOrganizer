#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const os = require("os");
const program = require("commander");
const { getDesktopFolder } = require("platform-folders");

const utils = require("./utils");
const { watchFolder } = require("./watch");

// Commander
program
  .name("FileOrganizer")
  .version(require("./package.json").version)
  .option("-d, --debug", "output extra debugging")
  .option("-w, --watch", "enable watch mode")
  .arguments("[directory_path]")
  .action(dir => {
    dirValue = dir;
  });

program.parse(process.argv);

// If watch flag, enable watch mode
if (program.watch) watchFolder(dirValue);

// Gets first argument as directory name, if not specified default to Desktop
const directoryPath = dirValue
  ? path.join(os.homedir(), dirValue)
  : getDesktopFolder();

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

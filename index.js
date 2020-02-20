#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const os = require("os");
const program = require("commander");
const { getDesktopFolder } = require("platform-folders");

const utils = require("./utils");
const { watchFolder } = require("./watch");

// Commander
program.version(require("./package.json").version);

program
  .option("-d, --debug", "Output extra debugging")
  .option("-D, --Directory <path>", "The directory path from the root folder")
  .option("-w, --watch", "Enable watch mode");

program.parse(process.argv);

if (program.watch) watchFolder(program.Directory);

// Gets first argument as directory name, if not specified default to Desktop
const directoryPath = program.Directory
  ? path.join(os.homedir(), program.Directory)
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

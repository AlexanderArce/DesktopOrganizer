const path = require("path");
const fs = require("fs-extra");
const os = require("os");

module.exports = {
  sortFiles: (extension, date, fileName, originalPath) => {
    let newPath;
    const year = new Date(date).getFullYear().toString();

    switch (extension) {
      case ".jpg":
      case ".png":
        newPath = path.join(os.homedir(), "Pictures", year, fileName);
        break;
      default:
        newPath = null;
        break;
    }

    if (newPath) {
      fs.move(originalPath, newPath, err => {
        if (err) return console.error(err);
        console.log(`Moved ${fileName} to ${newPath}`);
      });
    }
  }
};

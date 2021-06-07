/**

File: snippetUpload.js
Author: Howard Pearce
Last Edit: May 17, 2021
Description:  Class for management of code snippet uploads via multer.
              handles initialization and multer setup.
**/

var multer        = require('multer');
var snippets      = multer({dest: '../snippets/' });
const fs          = require("fs");
const path        = require('path');

class fileManager {
  constructor(args) {
    // some basic file upload security
    this.codeFilter = function(req, file, cb) {
      // only allow .py files (for now)
      if (!file.originalname.match(/\.(py)$/)) {
        req.fileValidationError = "Only .py files allowed.";
        return cb(new Error("Only .py files allowed."), false);
      } else {
        cb(null, true);
      }
    }

    // where we store snippets
    this.storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'snippets/');
        },
        // re-add file extension
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    this.multer = multer({storage: this.storage });
  }

  /**
   * Return multer upload single to be used for an upload in the codebase
   * @return {multer} The upload object to validate the file against
   */
  single() {
    // Max filesize is 1mb (1042 * 1024)
    return multer({ storage: this.storage,
                    fileFilter: this.codeFilter,
                    limits: { fileSize: 1024 * 1024 }}).single('code')
  }
}

var manager = new fileManager();
module.exports = manager;

// dependencies
var multer     = require('multer');
var snippets   = multer({dest: 'snippets/' });
const path = require('path');

exports.initMulter = function() {
  // set up storage location for files
  const storage = multer.diskStorage({
      destination: function(req, file, cb) {
          cb(null, 'snippets/');
      },

      // By default, multer removes file extensions so let's add them back
      filename: function(req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
  });

  // return the configured dependencies back to the calling function
  return [multer, storage];
};

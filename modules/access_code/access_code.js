/**

File: access_code.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Handles generation and management of the application's access code.

**/

var fs =            require("fs");
var crypto =        require("crypto");
const prompt =      require("prompt-sync")();
var logger =        require("logger");
var authenticator = require("authenticator");

class AccessCodeManager {

  constructor(filename) {
    this.filename = filename;
    this.code     = "";
  }

  /**
   * Provided a code, generate a txt file with the hashed access code.
   * @param {Subarg} code Optional access code. Will prompt for code if not used
   * @throw {Error} If access code is empty or file cannot be created
   */
  create_access_code(args) {
    if (!args.code) {
      // Does not use logger since this should be displayed no matter what
      console.log("Access code file does not exist yet.")
      console.log("You will be prompted to enter your access code, be sure to remember the code you provide. ")
      console.log("You will need it to log into the administrator account later, and it will not be accessible.")
      // Get the code from the user
      this.code = prompt("Enter access code: ");
    } else {
      this.code = args.code;
    }

    if (this.code.length < 3) {
      throw new Error("Access Code provided is less than 3 characters. Cannot continue.");
    }

    // get the hashed access code
    var hash = crypto.createHash('sha256').update(this.code).digest('hex');
    // write the hash to the access file
    fs.writeFile(this.filename, hash, function (err) {
      if (err) throw new Error(err);
    });
  }

  /**
   * Check if provided code matches hash in access file
   * @param {String} code The code to compare to the access file
   * @return {Boolean} Whether or not the code matches
   * @throw {Error} If file could not be opened
   */
  check_access(code) {
    return new Promise( (resolve, reject) => {
      var hashcode = crypto.createHash('sha256').update(code).digest('hex');
      logger.log_info("Received access code '" + code + "'" );
      logger.log_debug("Converted to hash '" + hashcode + "'");
      // get the code stored locally
      fs.readFile(this.filename, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          logger.log_debug("Loaded access code hash '" + data + "' from file.");
          // compare the submitted code to the stored one
          resolve(hashcode == data);
        }
      });
    });
  }

  /**
   * Set file name
   * @param {String} filename The new file name to set
   */
   set_filename(filename) {
     var re = /.*\.txt/
     if ( !re.test(filename) ) {
       throw new Error("Filename does not end in .txt");
     } else {
       this.filename = filename;
     }
   }


  /**
   * Delete the access file
   * @throw {Error} filesystem error when deleting
   */
   delete_access_file() {
     fs.unlinkSync(this.filename);
   }

  /**
   * Does the access file exit already?
   * @return {Boolean} If access file can be found
   */
  access_file_exists() {
    return fs.existsSync(this.filename);
  }

  /**
   * Is there an administrator account?
   * @return {Boolean} If admin account exists according to authenticator
   */
  admin_exists() {
    return authenticator.adminExists;
  }
}


var manager = new AccessCodeManager('access.txt');
module.exports = manager;

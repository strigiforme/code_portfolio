/**

File: access_code.js
Author: Howard Pearce
Last Edit: April 3, 2021
Description: Handles generation and management of the application's access code.

**/

var fs =            require("fs");
var crypto =        require("crypto");
const prompt =      require("prompt-sync")();
var logger =        require("./logger.js");
var authenticator = require("./authenticator.js");

// generate an access code file for the user
exports.generateAccessCode = function() {
  // check if an administrator account is present, if so we don't need to do any of this.
  if (!authenticator.adminExists) {
    // check if the access file doesn't exist
    if (!fs.existsSync("access.txt")) {
      // Does not use logger since this should be displayed no matter what
      console.log("Access code file does not exist yet.")
      console.log("You will be prompted to enter your access code, be sure to remember the code you provide. ")
      console.log("You will need it to log into the administrator account later, and it will not be accessible.")

      // prompt user to enter access code
      const code = prompt("Enter access code: ")

      // get the hashed access code
      var hash = crypto.createHash('sha256').update(code).digest('hex');

      // create the access file
      fs.open("access.txt", "w", function (err) {
        if (err) return logger.log_error(err);
      });

      // write the hash to the access file
      fs.writeFile("access.txt", hash, function (err) {
        if (err) return logger.log_error(err);
      });

    } else {
      // Log that we're skipping file generation
      logger.log_info("Access code already exists, skipping generation.");
    }
  } else {
    logger.log_info("Admin account already exists, skipping access code generation.");
  }
}

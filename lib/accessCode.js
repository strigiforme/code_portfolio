var fs = require("fs");
var crypto = require("crypto");
const prompt = require("prompt-sync")();

// generate an access code file for the user
exports.generateAccessCode = function() {
  // check if the access file doesn't exist
  if (!fs.existsSync("access.txt")) {
    // log the creation of the file
    console.log("Access code file does not exist yet.")
    console.log("You will be prompted to enter your access code, be sure to remember the code you provide. ")
    console.log("You will need it to log into the administrator account later, and it will not be accessible.")

    // prompt user to enter access code
    const code = prompt("Enter access code: ")

    // get the hashed access code
    var hash = crypto.createHash('sha256').update(code).digest('hex');

    // create the access file
    fs.open("access.txt", "w", function (err) {
      if (err) return console.log(err);
    });

    // write the hash to the access file
    fs.writeFile("access.txt", hash, function (err) {
      if (err) return console.log(err);
    });

  } else {
    // Log that we're skipping file generation
    console.log("Access code already exists, skipping generation.");
  }
}

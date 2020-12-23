var fs = require("fs");

// generate an access code file for the user
exports.generateAccessCode = function() {
  // check if the access file doesn't exist
  if (!fs.existsSync("access.txt")) {
    // log the creation of the file
    console.log("Access code file does not exist yet, creating now.")

    // access code
    var code = 'sleipnir'

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
    // Log that we're skipping file generations
    console.log("Access code already exists, skipping generation.");

  }
}

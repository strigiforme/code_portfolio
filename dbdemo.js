var Database         = require("./lib/database.js");

console.log("creating database");

database = new Database('mongodb://127.0.0.1/my_database');
var admin = database.getAdministrator();

admin.then(function(result) {
  console.log(result);
})

console.log("admin account:");
console.log(admin);

console.log("exiting");

//process.exit(1);

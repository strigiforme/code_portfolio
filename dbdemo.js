var Database         = require("./lib/database.js");

console.log("creating database");

database = new Database('mongodb://127.0.0.1/my_database');
// var admin = database.getAdministrator();
//
// admin.then(function(result) {
//   console.log("admin account:");
//   console.log(result);
// })

database.find_post("6029ad941df25d0ac0c4a407").then(function(post) {
  console.log("the post:");
  console.log(post.title);

}).catch( err => {
  console.log("an err finding the post!!!");
});

console.log("attempting deletion:");

database.delete_post("6029ad941df25d0ac0c4a407").then( post => {
  console.log("deleted the post: " + post);
  console.log("exiting");
  process.exit(1);
}).catch( err => {
  console.log("an err deleting the post!!!");
});

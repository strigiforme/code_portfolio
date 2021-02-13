var Database         = require("./lib/database.js");

console.log("creating database");

database = new Database('mongodb://127.0.0.1/my_database');
// var admin = database.getAdministrator();
//
// admin.then(function(result) {
//   console.log("admin account:");
//   console.log(result);
// })

database.find_post("6024993aa683f62628969a3").then(function(post) {
  if(post.error != null){
    console.log("i found the error");
  }
  console.log("the post:");

  console.log(post.title);

  console.log("exiting");
  process.exit(1);
}).catch( err => {
  console.log("an err!!!");
});

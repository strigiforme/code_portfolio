// dependencies
var express = require("express");
var router = express.Router();
// initialize app
var app = express();

// give access to public folder
app.use(express.static("public"));

// for receiving post requests
app.use(express.urlencoded({
  extended: true
}))

// listen callback
app.listen(3000, function(){
  console.log("Listening on port 3000!")
});

// get for root
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

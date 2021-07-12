/**

File: database.test.js
Author: Howard Pearce
Last Edit: July 3, 2021
Description: Test suite for database.js

**/

var Database = require("database");
var { MongoMemoryServer } = require('mongodb-memory-server');

// create mongodb database in memory to test on
mongod = new MongoMemoryServer();

beforeEach( async () => {
  await mongod.start();
  const uri = mongod.getUri();
  Database.connect(uri).then(console.log("Database connected successfully.")).catch( err => {console.log(err)});
});

afterEach( async () => {
  await Database.disconnect();
  await mongod.stop();
})

// Test that the database can connect to a mongodb instance successfully
test("Connect Database", async () => {

});

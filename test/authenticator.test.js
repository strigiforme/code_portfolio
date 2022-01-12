/**

File: authenticator.test.js
Author: Howard Pearce
Last Edit: August 28, 2021
Description: Test suite for authenticator.js

**/

var authenticator         = require("authenticator");
var { MongoMemoryServer } = require('mongodb-memory-server');
var database              = require("database");

// need a long timeout to download binaries
jest.setTimeout(20000);
// create mongodb database in memory to test on
mongod = new MongoMemoryServer({binary: {version: '5.0.1'}});

// testing variables
test_email = "test@test.com";

beforeAll( async () => {
  // Refresh and connect to mongodb instance synchronously
  await mongod.start();
  const uri = mongod.getUri();
  await database.connect(uri);
});

afterAll( async () => {
  // Disconnect from mongodb instance synchronously
  await database.disconnect();
  await mongod.stop();
});

test("Authenticator has correct default values.", () => {
  expect(authenticator.adminExists).toBe(false);
  expect(authenticator.admin).toBe(undefined);
  expect(authenticator.accessCodeValid).toBe(false);
  expect(authenticator.doAddAdmin).toBe(false);
})

test("Authenticator enters new email mode if no admin account is found.", async () => {
  // get the authenticator to fetch the admin account
  await authenticator.fetchAdminAccount();
  expect(authenticator.admin).toBe(undefined);
  expect(authenticator.doAddAdmin).toBe(true);
  expect(authenticator.adminExists).toBe(false);
})

test("Authenticator checks for administrator account.", async () => {
  // Insert a fake admin record for the authenticator to use
  await database.createAdmin(test_email);
  // get the authenticator to fetch the admin account
  await authenticator.fetchAdminAccount();
  expect(authenticator.admin).toBe(test_email);
  expect(authenticator.doAddAdmin).toBe(false);
  expect(authenticator.adminExists).toBe(true);
})

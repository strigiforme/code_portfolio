/**

File: database.test.js
Author: Howard Pearce
Last Edit: July 7, 2021
Description: Test suite for database.js

**/

// includes
const database              = require("database");
const middleware            = require("middleware");
const fs                    = require('fs');
const doc_package           = require("document");
const Document              = doc_package.Document;
const Module                = doc_package.Module;
const ModuleFactory         = doc_package.ModuleFactory;

var { MongoMemoryServer } = require('mongodb-memory-server');

// need a long timeout to download binaries
jest.setTimeout(20000);
// create mongodb database in memory to test on
mongod = new MongoMemoryServer({binary: {version: '5.0.1'}});

// data to be used in tests.
var testAdminArgs         = { email: "testemail@test.com" };
var testDocumentArgs      = { id: "123", title: "title", metadata: { tags: "test"} }
var testEditDocumentArgs = { id: "123", title: "new_title", metadata: { tags: "new"} }
var testModuleArgs        = { id: "paragraph", input: "test" }
var testEditModuleArgs   = { id: "image", input: "new" }

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

function compareDocuments(a, b) {
  expect(a.title).toBe(b.title);
  expect(a.metadata.tags).toBe(b.metadata.tags);
  expect(a.metadata.date.getTime()).toBe(b.metadata.date.getTime());
  expect(a.modules.length).toBe(a.modules.length);
  // compare each module
  a.modules.forEach( (module, i) => {
    var m_a = module;
    var m_b = b.modules[i];
    expect(m_a.module_type).toBe(m_b.module_type);
    expect(m_a.id).toBe(m_b.id);
    expect(m_a.html).toBe(m_b.html);
    expect(m_a.sanitized).toBe(m_b.sanitized);
    m_a.inputFields.forEach( (input, j) => {
      expect(input).toBe(m_b.inputFields[j]);
    })
  });
}

// Test that the database can create a document successfully
test("Create Document", async () => {
  try {
    var newModule = ModuleFactory.createModule(testModuleArgs.id);
    newModule.add_input(testModuleArgs.input);
    // create and test the document
    var newDoc = new Document(testDocumentArgs);
    newDoc.addModule(newModule);
    await database.createDocument(newDoc.export());
  } catch (error) {
    throw new Error(`Error occurred while creating document in database: ${error}`);
  }
});

// Test that the database can retrieve a document successfully
test("Find Documents", async () => {
  try {
    var results = await database.queryForDocuments({});
    // should be only one
    var doc = results[0];
    doc = new Document(doc);
    // query for the same document by ID
    var single = await database.findDocumentById(doc.id);
    single = new Document(single);
    // compare the two
    compareDocuments(doc, single);
  } catch (error) {
    throw new Error(`Error occurred while retrieving document in database: ${error}`);
  }
});

// Test that we can edit documents
test("Edit Document", async () => {
  try {
    // retrieve a document to edit
    var results = await database.queryForDocuments({});
    // should be only one
    var doc = results[0];
    // create a replacement document
    var newModule = ModuleFactory.createModule(testEditModuleArgs.id);
    newModule.add_input(testEditModuleArgs.input);
    var newDoc = new Document(testEditDocumentArgs);
    newDoc.addModule(newModule);
    // using the ID, update the document
    await database.editDocument(doc.id, newDoc);
    // check that the document has actually been updated
    var result = await database.findDocumentById(doc.id);
    compareDocuments(result, newDoc);
  } catch (error) {
    throw new Error(`Error occurred while editing document in database: ${error}`);
  }
});

// Test that we can create an admin account
test("Create Admin Account", async () => {
  try {
    await database.createAdmin(testAdminArgs.email);
  } catch (error) {
    throw new Error(`Error occurred while creating admin in database: ${error}`);
  }
});

// Test that we can query for admin accounts
test("Find Administrators", async () => {
  try {
    var admins = await database.queryForAdmins({});
    expect(testAdminArgs.email).toBe(admins[0].email);
  } catch (error) {
    throw new Error(`Error occurred while querying for admins in database: ${error}`);
  }
});

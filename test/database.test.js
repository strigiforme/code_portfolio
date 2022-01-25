/**

File: database.test.js
Author: Howard Pearce
Last Edit: July 7, 2021
Description: Test suite for database.js

**/

// includes
const database              = require("database");
const objects               = require("objects");
const middleware            = require("middleware");
const fs                    = require('fs');
const doc_package           = require("document");

const Post                  = objects.Post;
const Visitor               = objects.Visitor;
const Document              = doc_package.Document;
const Module                = doc_package.Module;
const ModuleFactory         = doc_package.ModuleFactory;

var { MongoMemoryServer } = require('mongodb-memory-server');

// need a long timeout to download binaries
jest.setTimeout(20000);
// create mongodb database in memory to test on
mongod = new MongoMemoryServer({binary: {version: '5.0.1'}});

// data to be used in tests.
var testPostArgs          = { id: "123", type:"blog", title:"test post", content:"test", snippet:undefined };
var testSnippetPostArgs  = { id: "123", type:"blog", title:"test post", content:"test", snippet:"test/snippets/testfile.txt" };
var testEditPostArgs     = { id: "123", type:"info", title:"new title", content:"new content", snippet:undefined };
var testVisitorArgs       = { ip: "123", first_visit: "2021-04-30T20:08:52.002Z", last_visit: "2021-04-30T20:08:52.002Z", visits: 5, location_string: "somewhere" };
var testEditVisitorArgs  = { id: "123", ip: "123", first_visit: "2021-05-30T20:08:52.002Z", last_visit: "2021-05-30T20:08:52.002Z", visits: 9, location_string: "over there" };
var testAdminArgs         = { email: "testemail@test.com" };
var testDocumentArgs      = { id: "123", title: "title", metadata: { tags: "test"} }
var testEditDocumentArgs = { id: "123", title: "new_title", metadata: { tags: "new"} }
var testModuleArgs        = { id: "paragraph", input: "test" }
var testEditModuleArgs   = { id: "image", input: "new" }

// do all our querying based on this post.
var test_post                = new Post(testPostArgs);

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

function comparePosts(a, b){
  expect(a.type).toBe(b.type);
  expect(a.title).toBe(b.title);
  expect(a.content).toBe(b.content[0]);
  expect(a.snippet).toBe(b.snippet);
}

function compareVisitors(a, b){
  expect(a.ip).toBe(b.ip);
  expect(a.location_string).toBe(b.location_string);
  expect(a.visits).toBe(b.visits);
  // not testing date strings since they're so damn tricky. Not worth the effort
}

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

// Test that the database can create a record successfully
test("Create Posts", async () => {
  try {
    await database.createPost(test_post.export_to_db());
  } catch (error) {
    throw new Error(`Error occurred while creating post in database: ${error}`);
  }
});

// Test that the database can query for posts
test("Find Posts", async () => {
  try {
    var posts = await database.queryForPosts( {} );
    // should be only one post in there right now
    var post = new Post(posts[0]);
    post = post.export_to_view();
    // confirm the values match what was put in
    comparePosts(testPostArgs, post);
    // try to query the database by it's unique ID
    var post_by_id = await database.findPostById(post.id);
    post_by_id = new Post(post_by_id).export_to_view();
    // store the ID for later
    testPostArgs.id = post.id;
    comparePosts(testPostArgs, post_by_id);
  } catch (error) {
    throw new Error(`Error occurred while searching for post in database: ${error}`);
  }
});

// Test that we can edit posts via their ID
test("Edit Post", async () =>  {
  try {
    await database.editPost(testPostArgs.id, testEditPostArgs);
    // retrieve the post again to see if edit was successful
    var edited_post = await database.findPostById(testPostArgs.id);
    edited_post = new Post(edited_post).export_to_view();
    comparePosts(testEditPostArgs, edited_post);
  } catch (error) {
    throw new Error(`Error occurred while editing post in database: ${error}`);
  }
});

// Test that we can delete posts that don't have a code snippet
test("Delete Post Without Snippet", async () => {
  try {
    await database.deletePost(testPostArgs.id);
    // confirm there are no posts left
    var posts = await database.queryForPosts( {} );
    expect(posts.length).toBe(0);
  } catch (error) {
    throw new Error(`Error occurred while deleting post in database: ${error}`);
  }
});

// Test that we can delete posts with a code snippet, along with their snippet
test("Delete Post With Snippet", async () => {
  try {
    // create a new post since we deleted the old one
    var new_post = await database.createPost(testSnippetPostArgs);
    // create an empty file that corresponds to a snippet
    if (!fs.existsSync("test/snippets")) {
      fs.mkdirSync("test/snippets");
    }
    await fs.writeFile("test/snippets/testfile.txt", "test", function (err) { if (err) throw err; });
    await database.deletePost(new_post._id);
    // confirm there are no posts left
    var posts = await database.queryForPosts( {} );
    expect(posts.length).toBe(0);
    // confirm the snippet file has been deleted
    expect(fs.existsSync("test/snippets/testfile.txt")).toBe(false);
  } catch ( error ) {
    throw new Error(`Error occurred while deleting post with a snippet in database: ${error}`);
  }
});

// Test that we can create a visitor in the database
test("Create Visitor Record", async () => {
  try {
    await database.createVisitor(testVisitorArgs);
  } catch (error) {
    throw new Error(`Error occurred while creating visitor in database: ${error}`);
  }
});

// Test that the database can query for visitors
test("Find Visitors", async () => {
  try {
    var visitors = await database.queryForVisitors( {} );
    // confirm the values match what was put in
    compareVisitors(testVisitorArgs, visitors[0]);
    // try to query the database by it's ip
    var visitor_by_id = await database.findVisitorByIp(visitors[0].ip);
    compareVisitors(testVisitorArgs, visitor_by_id);
    // use this in the next test
    testEditVisitorArgs.id = visitors[0]._id;
  } catch (error) {
    throw new Error(`Error occurred while searching for visitor in database: ${error}`);
  }
});

// Test that we can edit visitor records using their ID
test("Edit visitor record", async () => {
  try {
    await database.editVisitor(testEditVisitorArgs.id, testEditVisitorArgs);
    var new_visitor = await database.queryForVisitors({_id: testEditVisitorArgs.id});
    compareVisitors(new_visitor[0], testEditVisitorArgs);
  } catch (error) {
    throw new Error(`Error occurred while creating visitor in database: ${error}`);
  }
});

// Test that we can delete visitor records
test("Delete visitor", async () => {
  try {
    await database.deleteVisitor(testEditVisitorArgs.id);
    // confirm there are no posts left
    var visits = await database.queryForVisitors( {} );
    expect(visits.length).toBe(0);
  } catch (error) {
    throw new Error(`Error occurred while deleting visitor in database: ${error}`);
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

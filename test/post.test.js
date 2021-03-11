/**

File: post.test.js
Author: Howard Pearce
Last Edit: March 10, 2021
Description: Test suite for post.js

**/

var Post = require("../lib/post.js");

// variables to load into the post
const test_id = "123";
const test_type = "blog";
const test_title = "test post";
const test_content = "test";
const test_snippet = undefined;
const test_args = { id:test_id, type:test_type, title:test_title, content:test_content, snippet:test_snippet };

// test the constructor of the post obj with basic data
test("Basic Post Constructor Test", () => {
  var testPost = new Post(test_args);
  // confirm data was loaded correctly
  expect(testPost.post_id).toBe(test_id);
  expect(testPost.post_type).toBe(test_type);
  expect(testPost.post_title).toBe(test_title);
  expect(testPost.post_content).toBe(test_content);
  expect(testPost.post_snippet).toBe(test_snippet);
});

// Test post type behavior
test("Post Type Test", () => {
  var testPost = new Post(test_args);
  // confirm data was loaded correctly
  expect(testPost.type).toBe(test_type);
  // set the type to an unrecognized type
  testPost.post_type = "a dummy value";
  expect(testPost.post_type).toBe(testPost.types.unknown);
  // test all the other post types
  for (var type in testPost.types) {
    testPost.post_type = type;
    expect(testPost.post_type).toBe(type);
  }
});

// Test post export function
test("Post Export Test", () => {
  var testPost = new Post(test_args);
  var exp = testPost.export();
  expect(exp.snippet).toBe(undefined);
  testPost.post_snippet = "testvalue";
  exp = testPost.export();
  expect(exp.snippet).toBe("testvalue");
});

/**

File: access_code.test.js
Author: Howard Pearce
Last Edit: July 12, 2021
Description: Test suite for access_code package

**/

var access_code_mgr = require("access_code");

test("Test Create Access Code", () => {
  access_code_mgr.create_access_code( { code: "test" } );
});

test("Test Access Code fails for small string", () => {
  expect( () => {
    access_code_mgr.create_access_code( { code: "f" } );
  }).toThrow();
});

test("Set Filename test", () => {
  try {
    expect(access_code_mgr.set_filename("test"));
  } catch (e) {
    expect(e.message).toBe("Filename does not end in .txt")
  }
});

test("Test Check Access", () => {
  access_code_mgr.check_access( "test" ).then( result => {
    expect(result).toBe(true);
  });
  access_code_mgr.check_access( "bad_value" ).then( result => {
    expect(result).toBe(false);
  })
  access_code_mgr.set_filename()
});

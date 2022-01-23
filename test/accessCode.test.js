/**

File: accessCode.test.js
Author: Howard Pearce
Last Edit: July 12, 2021
Description: Test suite for accessCode package

**/

var accessCode_mgr = require("accessCode");

test("Test Create Access Code", () => {
  accessCode_mgr.createAccessCode( { code: "test" } );
});

test("Test Access Code fails for small string", () => {
  expect( () => {
    accessCode_mgr.createAccessCode( { code: "f" } );
  }).toThrow();
});

test("Test Check Access", () => {
  accessCode_mgr.checkAccess( "test" ).then( result => {
    expect(result).toBe(true);
  });
  accessCode_mgr.checkAccess( "bad_value" ).then( result => {
    expect(result).toBe(false);
  })
});

test("Set Filename test", () => {
  try {
    expect(accessCode_mgr.setFilename("test"));
  } catch (e) {
    expect(e.message).toBe("Filename does not end in .txt")
  }
});

/**

File: accessCode.test.js
Author: Howard Pearce
Last Edit: July 12, 2021
Description: Test suite for accessCode package

**/

var accessCodeMgr = require("accessCode");

test("Test Create Access Code", () => {
  accessCodeMgr.createAccessCode( { code: "test" } );
});

test("Test Access Code fails for small string", () => {
  expect( () => {
    accessCodeMgr.createAccessCode( { code: "f" } );
  }).toThrow();
});

test("Test Check Access", () => {
  accessCodeMgr.checkAccess( "test" ).then( result => {
    expect(result).toBe(true);
  });
  accessCodeMgr.checkAccess( "bad_value" ).then( result => {
    expect(result).toBe(false);
  })
});

test("Set Filename test", () => {
  try {
    expect(accessCodeMgr.setFilename("test"));
  } catch (e) {
    expect(e.message).toBe("Filename does not end in .txt")
  }
});

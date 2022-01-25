/**

File: logger.test.js
Author: Howard Pearce
Last Edit: July 12, 2021
Description: Test suite for logger

**/

var logger = require("logger");

test("Initialize logger", () => {
  logger.initialize( { level: "INFO" } );
});

test("Set logger level to known value", () => {
  // Try setting to all known log levels
  logger.setLevel("ERROR");
  logger.setLevel("WARNING");
  logger.setLevel("INFO");
  logger.setLevel("DEBUG");
  logger.setLevel("TRACE");
});

test("Set logger level to unknown value", () => {
  // should receive an exception
  expect( () => {
    logger.setLevel("TEST_VALUE");
  }).toThrow();
});

test("Test within limit", () => {
  expect( () => {
    logger.withinLimit("BAD_VALUE");
  }).toThrow();
});

test("Set logging function", () => {
  logger.setFunction( function(msg) {
    return "test";
  });
  expect(logger.info("not test")).toBe("test");
});

test("Test logs can be excluded", () => {
  // test up to warning level
  logger.setLevel("WARNING");
  // return test if log level is allowed, is undefined if not
  logger.setFunction( function(msg) {
    return "test";
  });
  expect(logger.error("")).toBe("test");
  expect(logger.warning("")).toBe("test");
  expect(logger.info("")).not.toBe("test");
  expect(logger.debug("")).not.toBe("test");
  expect(logger.trace("")).not.toBe("test");
  // Set to higher level for more testing
  logger.setLevel("TRACE");
  expect(logger.error("")).toBe("test");
  expect(logger.warning("")).toBe("test");
  expect(logger.info("")).toBe("test");
  expect(logger.debug("")).toBe("test");
  expect(logger.trace("")).toBe("test");
});

test("Test log format", () => {
  // regex to verify the log is formed as expected.
  // nd Corresponds to n digits
  // format 4d-1|2d-1|2d 1|2d:1|2d:1|2d log_type: log_message
  let re = /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}\sERROR: \w*/
  // Force the logger to return the log message as a string
  logger.setFunction(function(msg){ return msg; });
  expect(re.test(logger.error("test"))).toBe(true);
});

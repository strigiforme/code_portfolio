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
  logger.set_level("ERROR");
  logger.set_level("WARNING");
  logger.set_level("INFO");
  logger.set_level("DEBUG");
  logger.set_level("TRACE");
});

test("Set logger level to unknown value", () => {
  // should receive an exception
  expect( () => {
    logger.set_level("TEST_VALUE");
  }).toThrow();
});

test("Test within limit", () => {
  expect( () => {
    logger.within_limit("BAD_VALUE");
  }).toThrow();
});

test("Set logging function", () => {
  logger.set_function( function(msg) {
    return "test";
  });
  expect(logger.log_info("not test")).toBe("test");
});

test("Test logs can be excluded", () => {
  // test up to warning level
  logger.set_level("WARNING");
  // return test if log level is allowed, is undefined if not
  logger.set_function( function(msg) {
    return "test";
  });
  expect(logger.log_error("")).toBe("test");
  expect(logger.log_warning("")).toBe("test");
  expect(logger.log_info("")).not.toBe("test");
  expect(logger.log_debug("")).not.toBe("test");
  expect(logger.log_trace("")).not.toBe("test");
  // Set to higher level for more testing
  logger.set_level("TRACE");
  expect(logger.log_error("")).toBe("test");
  expect(logger.log_warning("")).toBe("test");
  expect(logger.log_info("")).toBe("test");
  expect(logger.log_debug("")).toBe("test");
  expect(logger.log_trace("")).toBe("test");
});

test("Test log format", () => {
  // regex to verify the log is formed as expected.
  // nd Corresponds to n digits
  // format 4d-1|2d-1|2d 1|2d:1|2d:1|2d log_type: log_message
  let re = /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}\sERROR: \w*/
  // Force the logger to return the log message as a string
  logger.set_function(function(msg){ return msg; });
  expect(re.test(logger.log_error("test"))).toBe(true);
});

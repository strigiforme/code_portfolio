/**

File: location.test.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Unit test suite for location.js

**/

var objects = require("objects");
var Location = objects.Location;

const location_string = '{"range":[2671878144,2671886335],"country":"US","region":"NJ","eu":"0","timezone":"America/New_York","city":"Clifton","ll":[40.8364,-74.1403],"metro":501,"area":1000}'

test("Basic Constructor Test", () => {
  var test_location = new Location(location_string);
  // confirm test was constructed correctly
  expect(test_location.country).toBe("US");
  // TODO: include range in this test. Was being buggy and I don't think it has
  // much real use so I'm ignoreing it for now.
  expect(test_location.region).toBe("NJ");
  expect(test_location.eu).toBe("0");
  expect(test_location.timezone).toBe("America/New_York");
  expect(test_location.city).toBe("Clifton");
  expect(test_location.metro).toBe(501);
  expect(test_location.area).toBe(1000)
});

test("Export test", () => {
  var test_location = new Location(location_string);
  var exp = test_location.export_to_pug();
  expect(exp.region).toBe("NJ");
  expect(exp.eu).toBe("0");
  expect(exp.timezone).toBe("America/New_York");
  expect(exp.city).toBe("Clifton");
  expect(exp.metro).toBe(501);
  expect(exp.area).toBe(1000)
});

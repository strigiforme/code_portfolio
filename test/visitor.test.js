/**

File: visitor.test.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Unit test suite for visitor.js

**/

var Visitor = require("../lib/core/database/visitor.js");

const test_id              = "123"
const test_first_visit     = "2021-04-30T20:08:52.002+00:00"
const test_last_visit      = "2021-04-30T20:08:52.002+00:00"
const test_visits          = 5
const test_ip              = "28e8582c198c7d84a856f2a673574beb72dd8ed8e65b93c8af351a9168d8c1b7"
const test_location_string = '{"range":[1496312320,1496312575],"country":"RO","region":"","eu":"1","timezone":"Europe/Bucharest","city":"","ll":[46,25],"metro":0,"area":200}'
const test_visitor_args    = { id: test_id, first_visit: test_first_visit, last_visit: test_last_visit, visits: test_visits, ip: test_ip, location_string: test_location_string }

test("Visitor Constructor Test", () => {
  var test_visitor = new Visitor(test_visitor_args);
  // confirm test was constructed correctly
  expect(test_visitor.id).toBe(test_id);
  expect(test_visitor.first_visit).toBe(test_first_visit);
  expect(test_visitor.last_visit).toBe(test_last_visit);
  expect(test_visitor.visits).toBe(test_visits);
  expect(test_visitor.ip).toBe('28e8582c19...');
  expect(test_visitor.location_string).toBe(test_location_string)
});

test("Export test", () => {
  var test_visitor = new Visitor(test_visitor_args);
  var exp = test_visitor.export_to_pug();
  expect(exp.id).toBe(test_id);
  expect(exp.first_visit).toBe(test_first_visit);
  expect(exp.last_visit).toBe(test_last_visit);
  expect(exp.visits).toBe(test_visits);
  expect(exp.ip).toBe('28e8582c19...');
  expect(exp.location_string).toBe(exp.location_string);
});

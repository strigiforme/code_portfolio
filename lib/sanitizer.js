/**

File: sanitizer.js
Author: Howard Pearce
Last Edit: Febuary 21, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

const sanitize       = require('mongo-sanitize');

var clean = function(input) {
  return sanitize(escape(input));
}

var prepare = function(input) {
  return unescape(input);
}

module.exports = {
  clean: clean,
  prepare: prepare
}

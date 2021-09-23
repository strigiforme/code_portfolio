/**

File: module_factory.js
Author: Howard Pearce
Last Edit: September 21, 2021
Description: Given the name of a module, return a new module

**/

var logger       = require("logger")
var Module       = require("./module")

module.exports = class ModuleFactory {

  constructor(args){}

  static create_module(name) {
    switch (name) {
      case "paragraph":
        logger.log_info("loading paragraph module")
        var newModule = new Module(
          { html : "<p class='moduleParagraph'> ? </p>"}
        )
        return newModule
        break
      default:
        logger.log_error("Module does not exist.")
    }
  }

}

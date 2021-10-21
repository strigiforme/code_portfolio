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
        logger.log_info("Creating paragraph module")
        var newModule = new Module(
          {
            html : "<p class='module-paragraph'> ? </p>",
            module_type : "paragraph"
          }
        )
        return newModule
        break
      case "image":
        logger.log_info("Creating image module")
        var newModule = new Module(
          {
            html : "<img src=\"?\" class='module-image'/>",
            module_type : "image"
          }
        )
        return newModule
        break
      default:
        logger.log_error("Module does not exist.")
    }
  }

}

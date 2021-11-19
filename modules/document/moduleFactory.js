/**

File: module_factory.js
Author: Howard Pearce
Last Edit: November 1, 2021
Description: Given the name of a module, return a new module

**/

var logger       = require("logger")
var Module       = require("./module")

module.exports = class ModuleFactory {

  /**
   * Returns an empty module object ready for use
   * @param {string} name - Name of the module. Serves as unique identifier
   * @returns {Module} Instantiated module object with required fields filled
   */
  static createModule(name) {
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

  /**
   * Returns the HTML inputs required for a user to fill in to instantiate a module
   * @param {string} name - Name of the module. Serves as a unique identifier
   * @returns {string} HTML with required inputs to fill in details on the module named
   */
   static getModuleHTML(name) {
     switch (name) {
       case "paragraph":
        return {html: "<input class='floating-input' type='text' name='paragraph'>"};
        break;
      default:
        throw "Module does not exist."
     }
   }
}

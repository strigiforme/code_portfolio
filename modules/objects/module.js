/**

File: module.js
Author: Howard Pearce
Last Edit: September 20, 2021
Description: Data structure that is a subcomponent of the document.

**/

module.exports = class Module {

  constructor(args) {
    this.id = args.id || args._id;
    this.html = args.html;
    this.inputFields = args.inputFields || [];
  }

  /**
   * Returns a copy of the module to be saved in the database
   * @Returns JSON with all of the document's attributes
   */
  export() {

  }

  /**
  * Returns a copy of the module as HTML
  * @Returns HTML for the document
  */
  render() {

  }

  /**
   * Sanitizes all of the module's fields to prevent injection
   */
  clean() {

  }
  
}

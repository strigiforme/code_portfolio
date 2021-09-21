/**

File: document.js
Author: Howard Pearce
Last Edit: September 20, 2021
Description: Data structure that is responible for storing and loading user generated pages.

**/

module.exports = class Document {

  constructor(args) {
    this.title = args.title;
    this.id = args.id || args._id;
    this.metadata = args.metadata;
    this.modules = args.modules || [];
  }

  /**
   * Returns a copy of the document to be saved in the database
   * @Returns JSON with all of the document's attributes
   */
   export() {

   }

  /**
  * Returns a copy of the document as HTML
  * @Returns HTML for the document
  */
  render() {

  }

  /**
   * Sanitizes all of the document's fields to prevent injection
   */
  clean() {

  }

  /**
   * Adds a module to the current list of modules
   * @param newModule the new module to add
   */
   addModule(newModule) {

   }

  /**
   * Removes a module from the current list of modules
   * @param id the unique ID of the module
   */
   removeModule(id) {

   }

}

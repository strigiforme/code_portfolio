/**

File: document.js
Author: Howard Pearce
Last Edit: September 20, 2021
Description: Data structure that is responible for storing and loading user generated pages.

**/

var middleware   = require("middleware")
var Sanitizer    = middleware.sanitizer;
var Module       = require("./module")
module.exports = class Document {

  constructor(args) {
    if ( !args ) { throw new Error("No arguments passed in to Document constructor.") }

    this.sanitized = args.sanitized || false;
    // load in arguments
    this.title = args.title;
    this.id = args.id || args._id;
    this.metadata = args.metadata || {};
    if ( !this.metadata.date ) {
      this.metadata.date = new Date();
    }
    this.modules = args.modules || [];

    // unescape characters if sanitized
    if ( this.sanitized ) {
      Sanitizer.prepare(this.title);
      this.modules.forEach( (module, index) => {
        this.modules[index] = new Module(module);
      });
    }

  }

  /**
   * Returns a copy of the document to be saved in the database
   * @Returns JSON with all of the document's attributes
   */
   export() {
     var exportedModuleArray = []
     // export the modules as well
     this.modules.forEach((module, index) => {
       exportedModuleArray.push(module.export())
     })

     var exportedDocument = {
       sanitized : true,
       title : Sanitizer.clean(this.title),
       id : this.id,
       metadata : this.metadata,
       modules : exportedModuleArray
     }

     return exportedDocument;
   }

  /**
  * Returns a copy of the document as HTML
  * @Returns HTML for the document
  */
  render() {
    var render_str = "<div class = 'document'>"
    this.modules.forEach(function (mod, index) {
      render_str += mod.render()
    })
    render_str += "</div>"
    return render_str
  }

  /**
   * Sanitizes all of the document's fields to prevent injection
   */
  clean() {
    this.modules.forEach(function (mod, index) {
      mod.clean();
    });
  }

  /**
   * Adds a module to the current list of modules
   * @param newModule the new module to add
   */
   addModule(newModule) {
     this.modules.push(newModule);
   }

  /**
   * Removes a module from the current list of modules
   * @param id the unique ID of the module
   */
   removeModule(id) {

   }

}

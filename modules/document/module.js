/**

File: module.js
Author: Howard Pearce
Last Edit: September 20, 2021
Description: Data structure that is a subcomponent of the document.

**/

var RenderError = require("./RenderError")
var middleware   = require("middleware")
var Sanitizer    = middleware.sanitizer;

module.exports = class Module {

  constructor(args) {
    this.module_type = args.module_type;
    this.id = args.id;
    this.html = args.html;
    this.inputFields = args.inputFields || [];
    this.sanitized = args.sanitized || false;

    if (this.sanitized) {
      this.html = Sanitizer.prepare(this.html);
      this.inputFields.forEach( (input, index) => {
        this.inputFields[index] = Sanitizer.prepare(input);
      })
    }

    this.numInputs = (this.html.match(/\?/g) || []).length;

  }

  prepare() {
    console.log(this.inputFields)
    // Prepare fields to prevent database injection
    this.inputFields.forEach(function (input, index) {
      console.log(input)
      this.inputFields[index] = Sanitizer.prepare(input);
    });
    this.html = Sanitizer.prepare(this.html)
  }

  /**
   * Returns a copy of the module to be saved in the database
   * @Returns JSON with all of the document's attributes
   */
  export() {
    var exportedInputFields = []
    // Sanitize fields to prevent database injection
    this.inputFields.forEach(function (input, index) {
      exportedInputFields.push(Sanitizer.clean(input));
    });

    // return as JSON
    return { sanitized: true, type: this.type, id: this.id, html: Sanitizer.clean(this.html), inputFields: exportedInputFields }
  }

  /**
   * Adds an item to the list of input fields
   * @param input the new input to be added
   */
  add_input(input) {
    this.inputFields.push(input);
  }

  /**
  * Returns a copy of the module as HTML
  * @Returns HTML for the document
  */
  render() {
    if (this.inputFields.length != this.numInputs) {
      throw new RenderError("Number of Inputs (" + this.numInputs +
       ") does not match number of inputs provided (" +
       this.inputFields.length + ")");
    }

    var render_str = this.html;
    var i = 0;
    while( render_str.indexOf("?") != -1) {
      var index = render_str.indexOf("?");
      render_str = render_str.slice(0, index) + this.inputFields[i] + render_str.slice(index+1);
      i++;
    }
    return render_str
  }
}

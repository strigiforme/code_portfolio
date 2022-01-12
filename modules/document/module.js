/**

File: module.js
Author: Howard Pearce
Last Edit: September 20, 2021
Description: Data structure that is a subcomponent of the document.

**/

var RenderError = require("./renderError")
var middleware   = require("middleware")
var Sanitizer    = middleware.sanitizer;

module.exports = class Module {

  constructor(args) {
    logger.log_debug("Creating module from args:");
    logger.log_debug(`module_type: ${args.module_type}`);
    this.module_type = args.module_type;
    logger.log_debug(`id: ${args.id}`);
    this.id = args.id;
    logger.log_debug(`html: ${args.html}`);
    this.html = args.html;
    logger.log_debug(`inputFields: ${args.inputFields}`);
    this.inputFields = args.inputFields || [];
    logger.log_debug(`sanitized: ${args.sanitized}`);
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
    return { sanitized: true, module_type: this.module_type, id: this.id, html: Sanitizer.clean(this.html), inputFields: exportedInputFields }
  }

  /**
   * Adds an item to the list of input fields
   * @param input the new input to be added
   */
  add_input(input) {
    this.inputFields.push(input);
  }

  /**
   * Returns a string representation of the module for debugging
   * @Returns a string representation of the module
   */
   toString() {
    var outputString = `Module: {\n`;
    outputString += `\tmodule_type: ${this.module_type}\n`;
    outputString += `\tid: ${this.id}\n`;
    outputString += `\tsanitized: ${this.sanitized}\n`;
    outputString += `\tinputFields: [`;
    this.inputFields.forEach(function (input, index) {
      outputString += `${input}, `;
    });
    // remove last ', ' from string representation of list
    outputString = outputString.substring(0, outputString.length -2);
    outputString += "]\n";
    outputString += `\thtml: ${this.html}\n}`;
    return outputString;
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

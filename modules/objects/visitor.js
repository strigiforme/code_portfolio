/**

File: visitor.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Class for visitors, does some basic operations on a post such as
             creating and sanitizing fields

**/


var middleware   = require("middleware")
var Sanitizer    = middleware.sanitizer;
var logger       = require("logger")
var Location     = require("./location.js")

module.exports = class Visitor {

  constructor(args) {
    this.id = args.id || args._id;
    this.last_visit = args.last_visit;
    this.first_visit = args.first_visit;
    this.location_string = args.location_string;
    this.location = new Location(this.location_string);
    this.ip = args.ip;
    this.visits = args.visits;
    this.clean();
  }

  /**
   * Debugging method to display all the information tied to a post
   */
  display() {
    output += "id: '"              + this.id      + "'\n";
    output += "ip: '"              + this.ip      + "'\n";
    output += "first visit: '"     + this.first_visit    + "'\n";
    output += "last visit: '"      + this.last_visit + "'\n";

    logger.log_info(output);
  }

  clean() {
    this.ip = this.ip.slice(0, 10) + "...";
  }

  /**
   * Prepare a post to be sent to MONGODB
   * @return An escaped Map-like representation of the post
   */
  export_to_db() {
    // clean the post data to prevent injection
    return this.export();
  }

  /**
   * Prepare a post to be sent to PUG and rendered for users
   * @return An unescaped map-like representation of the post
   */
  export_to_pug() {
    // unescape so that the post is readable
    return this.export();
  }

  /**
   * Convert a post's attributes into a map for use in other modules.
   * Called by other methods for different types of exporting
   * @return A Map-like representation of the post
   */
  export() {
    // determine if the post has a snippet, we shouldn't include it if there isn't one.
    return { id: this.id, ip: this.ip, first_visit: this.first_visit, last_visit: this.last_visit, location_string: this.location_string, location: this.location.export_to_pug(), visits: this.visits };
  }


}

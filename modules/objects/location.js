/**

File: visitor.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Class for location. Extracts fields from a string to store location
             data for a user's IP

**/

var middleware   = require("middleware")
var Sanitizer    = middleware.sanitizer;
var logger       = require("logger")
const path       = require('path')

module.exports = class Location {

  constructor(location_string) {
    // convert JSON string into real JSON object
    try {
      var parse = JSON.parse(location_string);
    } catch (error) {
      logger.log_trace(`Unable to parse location string '${location_string}'`);
    }

    // ignore empty strings
    if (parse != null) {
      // these are all the available fields from the string.
      // Not all of them are useful.
      this.country   = parse.country;
      this.range     = parse.range;
      this.region    = parse.region;
      this.timezone  = parse.timezone;
      this.city      = parse.city;
      this.metro     = parse.metro;
      this.area      = parse.area;
      this.eu        = parse.eu;
    } else {
      this.country   = "Unknown";
      this.range     = "Unknown";
      this.region    = "Unknown";
      this.timezone  = "Unknown";
      this.city      = "Unknown";
      this.metro     = "Unknown";
      this.area      = "Unknown";
      this.eu        = "Unknown";
    }
  }

  /**
   * Debugging method to display all the information tied to a post
   */
  display() {
    output += "country: '"   + this.country  + "'\n";
    output += "range: '"     + this.range    + "'\n";
    output += "region: '"    + this.region   + "'\n";
    output += "timezone: '"  + this.timezone + "'\n";
    output += "city: '"      + this.city     + "'\n";
    output += "metro: '"     + this.metro    + "'\n";
    output += "area: '"      + this.area     + "'\n";
    output += "eu: '"        + this.eu       + "'\n";
    logger.log_info(output);
  }

  clean() {
    this.country  = this.check_for_unknown(this.country);
    this.range    = this.check_for_unknown(this.range);
    this.region   = this.check_for_unknown(this.region);
    this.timezone = this.check_for_unknown(this.timezone);
    this.city     = this.check_for_unknown(this.city);
    this.metro    = this.check_for_unknown(this.metro);
    this.area     = this.check_for_unknown(this.area);
    this.eu       = this.check_for_unknown(this.eu);
  }

  check_for_unknown(value) {
    if ( value == null || value == undefined || value == "") {
      return "Unknown";
    } else {
      return value;
    }
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
    return { country: this.country, range: this.range, region: this.region, city: this.city, metro: this.metro, timezone: this.timezone, area: this.area, eu: this.eu };
  }


}

/**

File: post.js
Author: Howard Pearce
Last Edit: March 18, 2021
Description: Class for posts, does some basic operations on a post such as
             creating and sanitizing fields

**/

const post_types = { blog:"blog", info:"info", project:"project", unknown:"unknown" };
const Sanitizer  = require('./sanitizer.js')
var logger     = require("./logger.js")
const path       = require('path')

module.exports = class Post {

  constructor(args) {
    this.logger = args.logger;
    this.id = args.id || args._id;
    this.set_type(args.type);
    this.content = args.content;
    this.title = args.title;
    if ( args.snippet == undefined || args.snippet == "undefined" ) {
      logger.log_trace("Setting snippet to be undefined in post constructor");
      this.snippet = undefined;
    } else {
      logger.log_trace(`Setting snippet to be '${args.snippet}' post in constructor`);
      this.snippet = args.snippet;
    }
  }

  /**
   * Set the post type and ensure it is one of the known post types
   * @param {String} new_type the new post type we are setting our post to have
   */
  set_type(new_type) {
    var exists = false;
    for (var type in post_types) {
      if ( new_type == type ) {
        logger.log_trace(`Provided post type exists, setting post type to be value '${new_type}'`)
        this.type = new_type;
        exists = true;
      }
    }
    if (!exists) {
      logger.log_warning(`Setting post type to be unknown, type '${new_type}' was not recognized.`);
      this.type = post_types.unknown;
    }
  }

  /**
   * Debugging method to display all the information tied to a post
   */
  display() {
    output += "id: '"       + this.id      + "'\n";
    output += "title: '"    + this.title   + "'\n";
    output += "type: '"     + this.type    + "'\n";
    output += "content: '"  + this.content + "'\n";
    if (this.has_snippet) {
      output += "snippet: '"  + this.snippet + "'";
    } else {
      output += "snippet: N/A";
    }
    logger.log_info(output);
  }

  /**
   * Sanitize post data
   */
  clean() {
    logger.log_debug("Cleaning post data");
    logger.log_trace("Cleaning type '" + this.type + "' -> '" + Sanitizer.clean(this.type) + "'");
    this.type    = Sanitizer.clean(this.type);
    logger.log_trace("Cleaning content '" + this.content + "' -> '" + Sanitizer.clean(this.content) + "'");
    this.content = Sanitizer.clean(this.content);
    logger.log_trace("Cleaning title '" + this.title + "' -> '" + Sanitizer.clean(this.title) + "'");
    this.title   = Sanitizer.clean(this.title);
  }

  /**
   * Un-escape sanitized post to make it human readable
   */
  unescape() {
    logger.log_trace("Unescaping post data");
    logger.log_trace("Unescaping type '" + this.type + "' -> '" + unescape(this.type) + "'");
    this.type    = Sanitizer.prepare(this.type);
    logger.log_trace("Unescaping content '" + this.content + "' -> '" + unescape(this.content) + "'");
    this.content = Sanitizer.prepare(this.content);
    logger.log_trace("Splitting content '" + this.content + "' -> '" + this.content.split("\n") + "'");
    this.content = this.content.split("\n");
    logger.log_trace("Unescaping title '" + this.title + "' -> '" + unescape(this.title) + "'");
    this.title   = Sanitizer.prepare(this.title);
  }

  /**
   * Prepare a post to be sent to MONGODB
   * @return An escaped Map-like representation of the post
   */
  export_to_db() {
    // clean the post data to prevent injection
    this.clean();
    return this.export();
  }

  /**
   * Prepare a post to be sent to PUG and rendered for users
   * @return An unescaped map-like representation of the post
   */
  export_to_view() {
    // unescape so that the post is readable
    this.unescape();
    return this.export();
  }

  /**
   * Convert a post's attributes into a map for use in other modules.
   * Called by other methods for different types of exporting
   * @return A Map-like representation of the post
   */
  export() {
    // determine if the post has a snippet, we shouldn't include it if there isn't one.
    if ( !this.has_snippet ) {
      logger.log_trace("Exporting without snippet");
      return { id: this.id, title: this.title, type: this.type, content: this.content };
    } else {
      logger.log_trace("Exporting with snippet");
      return { id: this.id, title: this.title, type: this.type, snippet: this.snippet, content: this.content };
    }
  }

  // get and set methods
  get post_title()        { return this.title;   }
  get post_content()      { return this.content; }
  get post_type()         { return this.type;    }
  get post_snippet()      { return this.snippet; }
  get has_snippet()       { return !(this.snippet == undefined || this.snippet == "undefined"); }
  get post_id()           { return this.id;      }
  get post_snippet_path() { return path.dirname(require.main.filename) + "\\" + this.snippet.replace("\\","/"); }
  get types()             { return post_types;   }

  set post_title(value)   { this.title = value;   }
  set post_content(value) { this.content = value; }
  set post_type(value)    { this.set_type(value); }
  set post_snippet(value) { this.snippet = value; }
  set post_id(value)      { this.id = id;         }

}

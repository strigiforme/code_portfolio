/**

File: post.js
Author: Howard Pearce
Last Edit: Febuary 20, 2021
Description: Class for posts, does some basic operations on a post such as
             creating and sanitizing fields

**/

const post_types = { blog:"blog", info:"info", project:"project", unknown:"unknown" };
const sanitizer  = require('./sanitizer.js');
const path       = require('path');

module.exports = class Post {

  constructor(args) {
    this.id = args.id || args._id;
    this.set_type(args.type);
    this.content = args.content;
    this.title = args.title;
    if ( args.snippet == undefined || args.snippet == "undefined" ) {
      console.log("DEBUG: setting snippet to be undefined in post constructor");
      this.snippet = undefined;
    } else {
      console.log("DEBUG: setting snippet to be '" + args.snippet + "' post in constructor");
      this.snippet = args.snippet;
    }
  }

  // ensure that the post type is one of the known types
  set_type(new_type) {
    var exists = false;
    for (var type in post_types) {
      if ( new_type == type ) {
        this.type = new_type;
        exists = true;
      }
    }
    if (!exists) {
      this.type = post_types.unknown;
    }
  }

  // debug statement for showing a post
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
    console.log(output);
  }

  // sanitize the data in a post
  clean() {
    console.log("DEBUG: cleaning post data:");
    console.log("DEBUG: cleaning type '" + this.type + "' -> '" + sanitize(escape(this.type)) + "'");
    this.type    = sanitizer.clean(this.type);
    console.log("DEBUG: cleaning content '" + this.content + "' -> '" + sanitize(escape(this.content)) + "'");
    this.content = sanitizer.clean(this.content);
    console.log("DEBUG: cleaning title '" + this.title + "' -> '" + sanitize(escape(this.title)) + "'");
    this.title   = sanitizer.clean(this.title);
  }

  // make content presentable for user
  unescape() {
    console.log("DEBUG: unescaping post data:");
    console.log("DEBUG: unescaping type '" + this.type + "' -> '" + unescape(this.type) + "'");
    this.type    = sanitizer.prepare(this.type);
    console.log("DEBUG: unescaping content '" + this.content + "' -> '" + unescape(this.content) + "'");
    this.content = sanitizer.prepare(this.content);
    console.log("DEBUG: splitting content '" + this.content + "' -> '" + this.content.split("\n") + "'");
    this.content = this.content.split("\n");
    console.log("DEBUG: unescaping title '" + this.title + "' -> '" + unescape(this.title) + "'");
    this.title   = sanitizer.prepare(this.title);
  }

  // return an object representation of the post that can be understood by mongodb
  export_to_db() {
    // clean the post data to prevent injection
    this.clean();
    return this.export();
  }

  // return an object representation of the post that can be understood by pug
  export_to_view() {
    // unescape so that the post is readable
    this.unescape();
    return this.export();
  }

  export() {
    // determine if the post has a snippet, we shouldn't include it if there isn't one.
    if ( !this.has_snippet ) {
      console.log("DEBUG: exporting without snippet");
      return { id: this.id, title: this.title, type: this.type, content: this.content };
    } else {
      console.log("DEBUG: exporting with snippet");
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

  set post_title(value)   { this.title = value;   }
  set post_content(value) { this.content = value; }
  set post_type(value)    { this.set_type(value); }
  set post_snippet(value) { this.snippet = value; }
  set post_id(value)      { this.id = id;         }

}

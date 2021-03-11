/**

File: logger.js
Author: Howard Pearce
Last Edit: March 10, 2021
Description: Simple logging library that standardizes logging for the whole
             portfolio.

**/


// enumerate the log levels available to the logger
const log_levels = [ {name:"ERROR", scale: 1}, {name:"INFO", scale: 2} ];
const log_scale  = { ERROR: 1, INFO: 2, DEBUG: 3 };

module.exports = class Logger {
    constructor(args) {
      // configure the logging level via the arguments it's constructed with
      if ( !args.level ) {
        throw new Error("Log level was not provided. Unable to proceed.");
      }
      if ( this.is_level(args.level) ) {
        console.log("unger bunger");
      }
    }

    // checks if a provided level is a valid log level.
    // returns a boolean
    is_level(level) {
      for (var i = 0; i < log_levels.length; i++ ) {
        console.log(log_levels[i]);
        if (level == log_levels[i].name ) {
          this.log_info("Log level '" + level + "' exists.");
          return true
        }
      }
      return false;
    }

    log_info(msg) {
      this.log("INFO", msg);
    }

    log_error(msg) {
      this.log("ERROR", msg);
    }

    log_debug(msg) {
      this.log("DEBUG", msg);
    }

    log(level, msg) {
      console.log(level + ": " + msg);
    }
}

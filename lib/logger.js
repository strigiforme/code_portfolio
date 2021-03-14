/**

File: logger.js
Author: Howard Pearce
Last Edit: March 13, 2021
Description: Simple logging library that standardizes logging for the whole
             portfolio.

**/

// available log levels
const levels = new Map([
  ["ERROR",   1],
  ["WARNING", 2],
  ["INFO" ,   3],
  ["DEBUG",   4]
])

class Logger {

  /**
   * Initializes the logger
   * @param {String} level The log limit of the logger
   */
  constructor(args) {
    // default log level
    this.log_limit = 3;

    this.log_info("Starting logger module")

    // configure the logging level via the arguments it's constructed with
    if ( !args.level ) {
      throw new Error("Log level was not provided. Unable to proceed.")
    }

    // get the log scale for the provided level
    var log_level = this.is_level(args.level);

    // check if the log level is usable
    if ( log_level > 0) {
      this.log_info("Setting log limit to '" + args.level + "', which is a log scale of '" + log_level + "'" )
      this.log_limit = log_level
    } else {
      throw new Error("Log level '" + args.level + "' does not exist.")
    }
  }

  /**
   * Check if the log level provided exists within the logger
   * @param {String} level The level to be verified
   * @return {Integer} 0 if the level does not exist, if it does exist, the corresponding log level as an integer
   */
  is_level(level) {
    if ( levels.has(level) ) {
      this.log_debug("Log level '" + level + "' exists. Has scale of '" + levels.get(level) + "'")
      return levels.get(level)
    }
    this.log_debug("Log level '" + level + "' could not be found. Returning value of 0")
    return 0;
  }

  /**
   * Check if the provided log level is within the log limit
   * @param {String} level The log level to be verified
   * @return {Boolean} Whether the log level is within limit
   */
  within_limit(level) {
    if ( levels.has(level) ) {
      if ( levels.get(level) <= this.log_limit) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Log information using the logger
   * @param {String} msg The message to be logged
   */
  log_info(msg) {
    this.log("INFO", msg)
  }

  /**
   * Log information using the logger
   * @param {String} msg The message to be logged
   */
  log_warning(msg) {
    this.log("WARNING", msg)
  }

  /**
   * Log errors using the logger
   * @param {String} msg The message to be logged
   */
  log_error(msg) {
    this.log("ERROR", msg)
  }

  /**
   * Log debug using the logger
   * @param {String} msg The message to be logged
   */
  log_debug(msg) {
    this.log("DEBUG", msg)
  }

  /**
   * Log a message using the logger
   * @param {String} level The level of the message
   * @param {String} msg The message to be logged
   */
  log(level, msg) {
    if ( this.within_limit(level)) {
      console.log(level + ": " + msg)
    }
  }
}

logger = new Logger( {level:"DEBUG"} )

module.exports = logger;

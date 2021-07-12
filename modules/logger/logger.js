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
  ["DEBUG",   4],
  ["TRACE",   5]
])

// create a variable that will serve as our logging function
//let log_function = function(){};

class Logger {

  /**
   * Initializes the logger
   * @param {String} level The log limit of the logger
   */
  constructor(args) {
    // default log level
    this.log_limit = 3;
    // empty logging function to be overridden in initialization
    this.log_function = function(){};
  }

  /**
   * Start the logger
   * @param {json} args list of arguments to provide the logger
   */
  initialize(args) {
    this.log_info("Starting logger module")

    // check if argument was provided
    if ( !args.level ) {
      throw new Error("Log level was not provided. Unable to proceed.")
    }

    // allows us to change behaviour in the logging function if need be.
    if ( !args.log_function ) {
      this.log_function = function(msg) { console.log(msg); };
    } else {
      this.log_function = args.log_function;
    }

    this.set_level(args.level);
  }

  /**
   * Set the logging level after checking it's valid
   * @param {String} level The new logging level
   */
  set_level(level) {
    this.log_limit = this.get_level(level);
  }

  /**
   * Set the logging function to be the one provided
   * @param {Function} func The new logging function to be used
   */
   set_function(func) {
     this.log_function = func;
   }

  /**
   * Check if the log level provided exists within the logger
   * @param {String} level The level to be verified
   * @return {Boolean} false if the level does not exist, true if it does
   */
  is_level(level) {
    if ( levels.has(level) ) {
      return true
    }
    return false;
  }

  /**
   * Get the number corresponding to the log level provided
   * @param {String} level The level to search for
   * @throws error if the level does not exist
   */
   get_level(level) {
     if ( this.is_level(level) ) {
       return levels.get(level);
     } else {
       throw new Error(`Logging level \'${level}\' provided does not exist.
                        Check provided level exists before trying to set it.`);
     }
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
      throw new Error(`Logging level \'${level}\' provided does not exist.
                       Check provided level exists before trying to check it.`);
    }
  }

  /**
   * Log information using the logger
   * @param {String} msg The message to be logged
   */
  log_info(msg) {
    return this.log("INFO", msg);
  }

  /**
   * Log information using the logger
   * @param {String} msg The message to be logged
   */
  log_warning(msg) {
    return this.log("WARNING", msg);
  }

  /**
   * Log errors using the logger
   * @param {String} msg The message to be logged
   */
  log_error(msg) {
    return this.log("ERROR", msg);
  }

  /**
   * Log debug using the logger
   * @param {String} msg The message to be logged
   */
  log_debug(msg) {
    return this.log("DEBUG", msg);
  }

  /**
   * Log trace using the logger
   * @param {String} msg The message to be logged
   */
  log_trace(msg) {
    return this.log("TRACE", msg);
  }

  /**
   * Log a message using the logger
   * @param {String} level The level of the message
   * @param {String} msg The message to be logged
   */
  log(level, msg) {
    if ( this.within_limit(level)) {
      var now = new Date();
      var format_date = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} ${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`;
      return this.log_function(`${format_date} ${level}: ${msg}`);
    }
  }
}

logger = new Logger();
module.exports = logger;

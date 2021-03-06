/**

File: logger.js
Author: Howard Pearce
Last Edit: March 6, 2022
Description: Simple logging library that standardizes logging for the whole
             portfolio.

**/

const LogLevel = require("./LogLevel.js")

// create a variable that will serve as our logging function
//let logFunction = function(){};

class Logger {
  #logLimit;
  #logFunction;

  /**
   * Initializes the logger
   * @param {String} level The log limit of the logger
   */
  constructor(args) {
    // default log level
    this.#logLimit = 3;
    // empty logging function to be overridden in initialization
    this.#logFunction = function(){};
  }

  /**
   * Start the logger
   * @param {json} args list of arguments to provide the logger
   */
  initialize(args) {
    this.info("Starting logger module")

    if (!args) {
      args = {}
    }

    // allows us to change behaviour in the logging function if need be.
    if ( !args.logFunction ) {
      this.#logFunction = function(msg) { console.log(msg); };
    } else {
      this.#logFunction = args.logFunction;
    }

    if ( args.level ) {
      this.setLevel(args.level);
    }
  }

  /**
   * Set the logging level after checking it's valid
   * @param {String} level The new logging level
   */
  setLevel(level) {
    this.#logLimit = LogLevel.getLevelSeverity(level);
  }

  /**
   * Set the logging function to be the one provided
   * @param {Function} func The new logging function to be used
   */
   setFunction(func) {
     this.#logFunction = func;
   }

  /**
   * Check if the provided log level is within the log limit
   * @param {String} level The log level to be verified
   * @return {Boolean} Whether the log level is within limit
   */
  withinLimit(level) {
    if ( LogLevel.isLevel(level) ) {
      if ( LogLevel.getLevel(level).severity <= this.#logLimit) {
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
  info(msg) {
    return this.#log(LogLevel.INFO, msg);
  }

  /**
   * Log information using the logger
   * @param {String} msg The message to be logged
   */
  warning(msg) {
    return this.#log(LogLevel.WARNING, msg);
  }

  /**
   * Log errors using the logger
   * @param {String} msg The message to be logged
   */
  error(msg) {
    return this.#log(LogLevel.ERROR, msg);
  }

  /**
   * Log debug using the logger
   * @param {String} msg The message to be logged
   */
  debug(msg) {
    return this.#log(LogLevel.DEBUG, msg);
  }

  /**
   * Log trace using the logger
   * @param {String} msg The message to be logged
   */
  trace(msg) {
    return this.#log(LogLevel.TRACE, msg);
  }

  /**
   * Log a message using the logger
   * @param {String} level The level of the message
   * @param {String} msg The message to be logged
   */
  #log(level, msg) {
    if (!this.#logFunction) {
      console.log("WARNING: logFunction does not exist. Make sure you have initialized the Logger.")
    } else {
      // this is less efficient than it could be.
      if ( this.withinLimit(level.name)) {
        var now = new Date();
        var format_date = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} ${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`;
        return this.#logFunction(`${format_date} ${level.colorized}: ${msg}`);
      }
    }
  }
}

logger = new Logger();
module.exports = logger;

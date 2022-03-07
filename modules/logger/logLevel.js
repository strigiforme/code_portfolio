/**

File: logLevel.js
Author: Howard Pearce
Last Edit: March 6, 2022
Description: Enum of different possible log levels

**/

const chalk = require("chalk")

const ERROR_STR = "ERROR"
const WARNING_STR = "WARNING"
const DEBUG_STR = "DEBUG"
const INFO_STR = "INFO"
const TRACE_STR = "TRACE"

// borrows from https://www.sohamkamani.com/javascript/enums/

module.exports = class LogLevel {
  static ERROR   = new LogLevel(ERROR_STR, 1, chalk.red(ERROR_STR))
  static WARNING = new LogLevel(WARNING_STR, 2, chalk.yellow(WARNING_STR))
  static INFO    = new LogLevel(INFO_STR, 3, chalk.blue(INFO_STR))
  static DEBUG   = new LogLevel(DEBUG_STR, 4, chalk.magenta(DEBUG_STR))
  static TRACE   = new LogLevel(TRACE_STR, 5, chalk.gray(TRACE_STR))

  constructor(name, severity, colorized) {
    this.name = name
    this.severity = severity
    this.colorized = colorized
  }

  /**
   * Is the provided log level an existing one
   * @param {String} name the name of the log level
   * @return {Bool} if the log level exists
   */
  static isLevel(name) {
    try {
      LogLevel.getLevel(name)
      return true
    } catch (err) {
      return false
    }
  }

  /**
   * Get log level by name
   * @param {String} name the name of the log level
   * @return {LogLevel} the enum corresponding to the name
   */
  static getLevel(name) {
    if (name == ERROR_STR) {
      return this.ERROR
    } else if (name == WARNING_STR) {
      return this.WARNING
    } else if (name == DEBUG_STR) {
      return this.DEBUG
    } else if (name == INFO_STR) {
      return this.INFO
    } else if (name == TRACE_STR) {
      return this.TRACE
    } else {
      throw new Error(`Logging level \'${level}\' provided does not exist.
                       Check provided level exists before trying to set it.`)
    }
  }

  /**
   * Get log level severity by name
   * @param {String} name the name of the log level
   * @return {Integer} the severity of the log level provided
   */
  static getLevelSeverity(name) {
    return LogLevel.getLevel(name).severity
  }
}

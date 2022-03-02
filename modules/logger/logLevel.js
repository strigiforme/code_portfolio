/**

File: logLevel.js
Author: Howard Pearce
Last Edit: March 1, 2022
Description: Enum of different possible log levels

**/

// borrows from https://www.sohamkamani.com/javascript/enums/

module.exports = class LogLevel {
  static ERROR   = new LogLevel("ERROR", 5)
  static WARNING = new LogLevel("WARNING", 4)
  static DEBUG   = new LogLevel("DEBUG", 3)
  static INFO    = new LogLevel("INFO", 2)
  static TRACE   = new LogLevel("TRACE", 1)

  constructor(name, severity) {
    this.name = name
    this.severity = severity
  }

  static isLevel(name) {
    try {
      LogLevel.getLevel(name)
      return true
    } catch (err) {
      return false
    }
  }

  static getLevel(name) {
    if (name == "ERROR") {
      return this.ERROR
    } else if (name == "WARNING") {
      return this.WARNING
    } else if (name == "DEBUG") {
      return this.DEBUG
    } else if (name == "INFO") {
      return this.INFO
    } else if (name == "TRACE") {
      return this.TRACE
    } else {
      throw new Error(`Logging level \'${level}\' provided does not exist.
                       Check provided level exists before trying to set it.`)
    }
  }

  static getLevelSeverity(name) {
    return LogLevel.getLevel(name).severity
  }
}

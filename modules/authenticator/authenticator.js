/**

File: authenticator.js
Author: Howard Pearce
Last Edit: February 20, 2022
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

var database = require('database')
var logger = require('logger')
var AccessCode = require('./accessCode.js')

class Authenticator {

  /**
   * Construct the Authenticator
   * @param {Database} database Reference to the database module.
   * @param {Boolean} adminEnabled Whether or not to check for admin account.
   * @param {String} accessCodePath The filepath to the access code. Relative to project root.
   */
  constructor (database, adminEnabled, accessCodePath) {
    this.adminAccount = undefined
    this.addAdminFlag = false
    this.accessCodeValid = false
    this.accessCode = new AccessCode(accessCodePath)
    this.database = database
    this.adminEnabled = adminEnabled
  }

  /**
   * @brief Retrieve the admin account from database. Initialize Access Code as well.
   */
  async initialize () {
    try {
      // retrieve the administrator account's email
      var result = await database.getAdminAccount()
      this.adminAccount = result.account
      this.addAdminFlag = result.new
      // initialize access code
      if (!this.adminExists && !this.accessCode.accessFileExists) {
        this.accessCode.createAccessCode()
      }
    } catch (error) {
      logger.error('ERROR: promise rejection while getting administrator account email: ' + error)
    }
  }

  /**
   * @brief handle access code from user.
   * @param {String} inputAccessCode the users input to be compared.
   */
  async compareAccessCode (inputAccessCode) {
    var result = await this.accessCode.compare(inputAccessCode)
    return result
  }

  /** Getters and Setters **/
  get adminExists () { return !(this.adminAccount == undefined) }
  get doAddAdmin () { return this.addAdminFlag }
  set doAddAdmin (value) { this.addAdminFlag = value }
  get admin () { return this.adminAccount }
  set admin (value) { this.adminAccount = value }
  get isAccessCodeValid () { return this.accessCodeValid }
  set isAccessCodeValid (value) { this.accessCodeValid = value }
}

logger.debug('constructing authenticator')
var authenticator = new Authenticator(database, false, 'access.txt')

module.exports = authenticator

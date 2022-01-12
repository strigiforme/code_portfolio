/**

File: authenticator.js
Author: Howard Pearce
Last Edit: June 8, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

var database = require("database");
var logger   = require("logger");

class Authenticator {

  /**
   * Construct the Authenticator
   * @param {String} adminAccount The email address of the administrators account.
   * @param {Boolean} addAdminFlag boolean flag that identifies if we are in 'new' mode. (No admin exists, and we need to add one)
   * @param {Boolean} accessCodeValid boolean flag that identifies if the access code the user entered is valid. Set by the access_code module.
   * @param {Database} database reference to the database module.
   * @param {Boolean} adminEnabled whether or not to check for admin account
   */
  constructor(database, adminEnabled) {
    this.adminAccount = undefined;
    this.addAdminFlag = false;
    this.accessCodeValid = false;
    this.database = database;
    this.adminEnabled = adminEnabled
  }

  /**
   * Retrieve the admin account from database.
   */
  async fetchAdminAccount() {
    try {
      // retrieve the administrator account's email
      var result = await database.getAdminAccount();
      this.adminAccount = result.account;
      this.addAdminFlag = result.new;
    } catch (error) {
      logger.log_error("ERROR: promise rejection while getting administrator account email: " + error);
    }
  }

  /** Getters and Setters **/
  get adminExists() { return !(this.adminAccount == undefined); }
  get doAddAdmin() { return this.addAdminFlag; }
  set doAddAdmin(value) { this.addAdminFlag = value; }
  get admin() { return this.adminAccount; }
  set admin(value) { this.adminAccount = value; }
  get isAccessCodeValid() { return this.accessCodeValid; }
  set isAccessCodeValid(value) { this.accessCodeValid = value; }
}

var auth = new Authenticator(database);

module.exports =  auth;

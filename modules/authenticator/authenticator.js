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

  constructor(database) {
    this.adminAccount = undefined;
    this.addAdminFlag = false;
    this.accessCodeValid = false;
    this.database = database;
  }

  async fetchAdminAccount() {
    try {
      // retrieve the administrator account's email
      var result = await database.get_admin_account();
      this.adminAccount = result.account;
      this.addAdminFlag = result.new;
    } catch (error) {
      logger.log_error("ERROR: promise rejection while getting administrator account email: " + error);
    }
  }

  get adminExists() {
    return !(this.adminAccount == undefined);
  }

  get doAddAdmin() {
    return this.addAdminFlag;
  }

  set doAddAdmin(value) {
    this.addAdminFlag = value;
  }

  get admin() {
    return this.adminAccount;
  }

  set admin(value) {
    this.adminAccount = value;
  }

  get isAccessCodeValid() {
    return this.accessCodeValid;
  }

  set isAccessCodeValid(value) {
    this.accessCodeValid = value
  }
}

var auth = new Authenticator(database);

module.exports =  auth;

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
    this.addAdmin = false;
    this.accessCodeValid = false;
    this.database = database;
  }

  fetchAdminAccount() {
    // retrieve the administrator account's email
    database.getAdminAccount().then( result => {
      this.adminAccount = result.account;
      this.addAdmin = result.new;
    }).catch( reason => {
      logger.log_error("ERROR: promise rejection while getting administrator account email: " + reason);
    });
  }

  get adminExists() {
    return !(this.adminAccount == undefined);
  }

  get doAddAdmin() {
    return this.addAdmin;
  }

  set doAddAdmin(value) {
    this.addAdmin = value;
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

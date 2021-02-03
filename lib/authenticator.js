/**

File: authenticator.js
Author: Howard Pearce
Last Edit: Febuary 2, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

const utils = require("./utils.js");

module.exports = class Authenticator {

  constructor(adminSchema) {
    this.adminAccount = undefined;
    this.addAdmin = false;
    this.accessCodeValid = false;

    // retrieve the administrator account's email
    utils.getAdminAccount(adminSchema, this.addAdmin).then( result => {
      this.adminAccount = result[0];
      this.addAdmin = result[1];
    }, reason => {
      console.error("ERROR: promise rejection while getting administrator account email: " + reason);
    });
  }

  get adminExists() {
    return this.adminAccount == undefined;
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

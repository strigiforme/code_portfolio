/**

File: authenticator.js
Author: Howard Pearce
Last Edit: Febuary 2, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

const utils = require("./utils.js");

module.exports = class Authenticator {

  constructor() {
    this.adminAccount = null;
    this.addAdmin = false;
  }

  get adminExists() {
    return this.adminAccount == null;
  }

  get doAddAdmin() {
    return this.addAdmin;
  }


}

/**

File: authenticator.js
Author: Howard Pearce
Last Edit: Febuary 21, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

var database = require("./database.js");
var logger =        require("./logger.js");

class Authenticator {

  constructor(database) {
    this.adminAccount = undefined;
    this.addAdmin = false;
    this.accessCodeValid = false;
    this.database = database;

    // retrieve the administrator account's email
    database.getAdminAccount().then( result => {
      this.adminAccount = result.account;
      this.addAdmin = result.new;
    }).catch( reason => {
      logger.error("ERROR: promise rejection while getting administrator account email: " + reason);
    });
  }

  /**
   * Authentication middleware
   * @param {Object} req the request Object
   * @param {Object} res the response object
   * @param {Object} next what to do next
   */
  authenticateUser (req, res, next) {
    // check if we're allowed to be here
    if(!req.session.login){
      res.redirect("/forbidden");
    } else {
      if (req.session.email != authenticator.admin) {
       res.redirect("/forbidden");
      } else {
        next();
      }
    }
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

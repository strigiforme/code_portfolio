/**

File: authenticator.js
Author: Howard Pearce
Last Edit: Febuary 13, 2021
Description: Manages authentication for portfolio application. This includes
             login, logout, current administrators, etc.

**/

var auth = class Authenticator {

  constructor(database) {
    this.adminAccount = undefined;
    this.addAdmin = false;
    this.accessCodeValid = false;
    this.database = database;

    // retrieve the administrator account's email
    database.getAdminAccount(this.addAdmin).then( result => {
      this.adminAccount = result.account;
      this.addAdmin = result.new;
    }).catch( reason => {
      console.error("ERROR: promise rejection while getting administrator account email: " + reason);
    });
  }

  // callback to protect pages
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

var auth_callback = function (req, res, next) {
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

module.exports = {
  Authenticator: auth,
  AuthenticatorCallback: auth_callback
}

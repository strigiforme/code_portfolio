/**

File: verify.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Callback function to create limited access areas of software

**/

var authenticator = require("authenticator");

var auth_callback = function (req, res, next) {
  // check if we're allowed to be here
  if (authenticator.authEnabled) {
    if(!req.session.login){
      res.redirect("/forbidden");
      next();
    } else {
      if (req.session.email != authenticator.admin) {
        res.redirect("/forbidden");
        next();
      } else {
        next();
      }
    }
  }
  next();
}

module.exports = auth_callback;

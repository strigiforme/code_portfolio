var authenticator = require("./authenticator.js");

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

module.exports = auth_callback;

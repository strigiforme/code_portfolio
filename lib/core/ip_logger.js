/**

File: ip_logger.js
Author: Howard Pearce
Last Edit: April 5, 2021
Description: Logs IP addresses of visitors to the website

**/

var database = require("./database.js");
var logger   = require("./logger.js");
var locate   = require("geoip-lite");
var crypto   = require("crypto");


var ip_callback = function(req, res, next) {
  // retrieve the visitor's IP address
  let visitorAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
  // remove any extra addresses if they occur
  visitorAddress = visitorAddress.split(",")[0];
  // remove extra padding that gets in the way
  visitorAddress = String(visitorAddress.split(":").slice(-1));
  // should have just the IP address at this point, get the user's location using their IP
  logger.log_debug("Recevied IP address '" + visitorAddress + "'");
  var hash = crypto.createHash('sha256').update(visitorAddress).digest('hex');
  var location = locate.lookup(visitorAddress);
  var now = new Date()
  database.create_visitor({date: now, location: JSON.stringify(location), ip: hash}).then(result => {
    next();
  }).catch( err => {
    logger.log_error("Unable to save visitor IP:" + err);
    next();
  });
}

module.exports = ip_callback;

/**

File: ip_logger.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Logs IP addresses of visitors to the website

**/

var database = require("database");
var logger   = require("logger");
var locate   = require("geoip-lite");
var crypto   = require("crypto");


var ip_callback = function(req, res, next) {
  // retrieve the visitor's IP address
  let visitorAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
  try {
    visitorAddress = visitorAddress.split(",")[0];
    visitorAddress = String(visitorAddress.split(":").slice(-1));
  } catch (error) {
    logger.error("Problem splitting visitor address: " + error)
  }
  // should have just the IP address at this point, get the user's location using their IP
  logger.debug("Recevied IP address '" + visitorAddress + "'");
  // hash the IP to protect the users privacy
  var hash = crypto.createHash('sha256').update(visitorAddress).digest('hex');

  database.findVisitorByIp(hash).then(visitor => {
    // we haven't seen this IP before
    if (visitor == null) {
      // Get their physical location using their IP
      var location = locate.lookup(visitorAddress);
      var now = new Date()
      database.createVisitor({lastvisit: now, firstvisit: now, location_string: JSON.stringify(location), ip: hash, visits: 1}).then(result => {
        next();
      }).catch( err => {
        logger.error("Unable to save visitor IP:" + err);
        next();
      });
    } else {
      // take the visitor and increment their visits
      visitor.visits += 1;
      visitor.lastvisit = new Date();
      databaseeditVisitor(visitor._id, visitor).then(result => {
        next();
      }).catch( err => {
        logger.log_err("Unable to increment visitor count: " + err);
      });
    }
  }).catch( err => {
    logger.error("Unable to retrieve visitor by IP: " + err);
  })


}

module.exports = ip_callback;

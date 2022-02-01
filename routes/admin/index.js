/**

File: index.js
Author: Howard Pearce
Last Edit: December 06, 2021
Description: Handles all logic for the administration of the portfolio

**/

var express         = require("express");
const fs            = require("fs");
var { exec }        = require("child_process");
const path          = require('path');
var database        = require("database");
var logger          = require("logger");
var snippets        = require("fileUpload");
var authenticator   = require("authenticator");
var middleware      = require("middleware");
var doc_package     = require("document");
var Sanitizer       = middleware.sanitizer;
var authenticate    = middleware.verify;

const upload        = snippets.multer;

var Document        = doc_package.Document;
var Module          = doc_package.Module;
var ModuleFactory   = doc_package.ModuleFactory;

var app = module.exports = express();

/* Handler for AJAX request to get a module's HTML form. */
app.get("/get_module_html", authenticate, function (req, res, next) {
  var moduleName = Sanitizer.clean(req.query.module);
  var moduleCount = Sanitizer.clean(req.query.count);
  if (moduleName != undefined && moduleCount != undefined ) {
    try {
      var moduleHTML = ModuleFactory.getModuleHTML(moduleName, moduleCount);
      logger.debug("Returning HTML '" + moduleHTML + "' to module HTML request");
      res.send(moduleHTML);
      res.end();
    } catch (error) {
      res.status(400).send({
        message: error
      });
    }
  } else {
    logger.error("Unable to retrieve input HTML for module '" + req.query.module + "'");
    res.end();
  }
});

app.get("/document/create", authenticate, function (req, res, next) {
  res.render("document/createDocument", {loggedin: req.session.login});
  res.end();
});

app.post("/document/upload", upload.any(), authenticate, function (req, res, next) {
  // grab the default document items
  var docTitle = req.body.title;
  // get a document ready to insert modules into
  var newDocument = new Document( { title: docTitle } );

  // iterate over the modules the user has sent
  for ( const [item, value] of Object.entries(req.body) ) {
    // regex match to see if it's a valid module
    var moduleRegex = item.match(/(\w*)\:(\d+)/);
    if ( moduleRegex ) {
      var moduleName = moduleRegex[1];
      var moduleIndex = moduleRegex[2];
      if ( ModuleFactory.isModule(moduleName) ) {
        // construct a module from the user's input
        var newModule = ModuleFactory.createModule(moduleName);
        logger.info(`first module after creating it: ${newModule.toString()}`);
        newModule.add_input(value);
        newDocument.addModule(newModule);
      } else {
        logger.error(`Module type '${moduleName}' does not exist.`);
        // TODO: implement proper rejection. Should probably throw if this happens
      }
    }
  }

  if (newDocument.numberOfModules() > 0 ) {
    // submit to database
    database.createDocument(newDocument.export()).then( result => {
      res.render("document/createDocument", {loggedin: req.session.login});
    });
  } else {
    logger.warning("Warning: submitting an empty document (no modules) to the database.");
    res.end();
  }
});

// THIS SECTION ALL RELATES TO HANDLING REQUESTS FOR LOGGING IN / CONFIRMING IDENTITY
// get request to logout
app.get('/logout', function (req, res, next) {
  req.session.email = null;
  req.session.login = false;
  res.redirect('/');
});

// get request for login page
app.get("/admin", authenticate, function (req, res, next){
});

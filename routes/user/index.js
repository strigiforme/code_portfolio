/**

File: index.js
Author: Howard Pearce
Last Edit: May 2, 2021
Description: Handles all logic for users

**/

var express          = require("express");
var database         = require("database");
var middleware       = require("middleware");
var logger           = require("logger");
const fs             = require("fs");
var { exec }         = require("child_process");
var document_package = require("document");
var Document         = document_package.Document;
var Sanitizer        = middleware.sanitizer;

var app = module.exports = express();

// get request for root page
app.get('/' ,function (req, res, next) {
  var login_status = req.query.login;
  res.render('index', {loggedin: req.session.login, login: login_status});
  res.end()
});

app.get('/document_test', function (req, res, next) {
  var document_id = req.query.doc;
  var document_view = database.findDocumentById(document_id).then( doc => {
    var clean_doc = new Document(doc);
    logger.debug("Document: " + clean_doc.toString());
    logger.debug("Rendered HTML: " + clean_doc.render());
    res.render("document", { doc : clean_doc });
    res.end();
  });
});

app.get('/resume', function (req, res, next) {
  res.render("resume", {loggedin: req.session.login});
});

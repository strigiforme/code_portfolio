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
var objects         = require("objects");
var logger          = require("logger");
var snippets        = require("fileUpload");
var record          = require("ip_logger");
var authenticator   = require("authenticator");
var middleware      = require("middleware");
var doc_package     = require("document");
var Sanitizer       = middleware.sanitizer;
var authenticate    = middleware.verify;

const upload        = snippets.multer;
var Post            = objects.Post;
var Visitor         = objects.Visitor;
var Location        = objects.Location;

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

// app.get("/posts/uploaderror", function (req, res, next) {
//   res.render("posts/uploaderror", {loggedin: req.session.login});
//   res.end();
// });
//
// app.get("/posts/add", authenticate, function (req, res, next) {
//   res.render("posts/addpost", {loggedin: req.session.login});
//   res.end();
// });

// app.get("/search_posts", authenticate, function (req, res, next) {
//   var params = Sanitizer.clean(req.query.search);
//   if (params != undefined) {
//     // search for any title that contains the substring provided by the user
//     var regex = new RegExp(params, 'i');
//     var search_args = { title: {$regex: regex} };
//     database.queryForPosts(search_args).then(posts => {
//       // logic for presenting search results is in ajax.js
//       res.send( { posts: posts } );
//       res.end();
//     }).catch( error => {
//       logger.error(`Error occurred while searching for posts.
//                         Unable to return search request: ${error}`);
//       res.end();
//     });
//   }
// });

// upload a new post to database
// app.post("/posts/upload-post", upload.single("code"), function (req, res, next) {
//     if ( req.fileValidationError ) {
//       logger.warning("Rejecting file upload: " + req.fileValidationError);
//       return res.redirect("uploaderror");
//     }
//     // construct args for post object
//     var post_args = {id:"", title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
//     // check if a file was submitted with this post (a code snippet)
//     if (req.file) { post_args.snippet = req.file.path; }
//     // create a post object from the extracted args
//     var new_post = new Post(post_args);
//     // create new db object using data
//     database.create_post(new_post.export_to_db()).then( result => {
//       res.redirect("/admin");
//       res.end();
//     }).catch (err => {
//       res.redirect("posts/posterror");
//     });
// });
//
// // delete a post
// app.post("/posts/delete_post", authenticate, function (req, res, next) {
//   var id = Sanitizer.clean(req.body.id);
//   // get database to delete post
//   database.delete_post(id).then( result => {
//     // send back to admin page with result in a query string
//     res.redirect("/admin?delete=true");
//     res.end();
//   }).catch( err => {
//     logger.error(err)
//     next(err);
//   });
// });
//
// // take user to page to edit post
// app.post("/posts/edit_post", authenticate, function (req, res, next) {
//   // extract the ID of the post from the post request
//   var id = Sanitizer.clean(req.body.id);
//   // get the post using its ID
//   database.findPostById(id).then( post => {
//       // load the found post
//       var to_edit = new Post(post);
//       // give user a page to edit the content
//       res.render("posts/editpost", {loggedin: req.session.login, postData: to_edit.export_to_view()})
//   }).catch( err => {
//       database.post_fail(res, err);
//   });
// });
//
// // upload edited post to databse
// app.post("/posts/upload-post-edit", authenticate, upload.single("code"), function (req, res, next) {
//   // load the request into arguments to construct a post
//   var post_args = {id:req.body.id, title:req.body.title, content:req.body.content, type:req.body.type, snippet: undefined}
//   //upload(req, res, function(err) {
//     if ( req.fileValidationError ) {
//       logger.warning("Rejecting file upload: " + req.fileValidationError);
//       return res.redirect("uploaderror");
//     }
//     // else if (err) {
//     //   logger.warning("Rejecting file upload: " + err);
//     //   return res.redirect("uploaderror");
//     // }
//     // check if new post edit has a file
//     if (req.file) {
//       logger.info("New code snippet submitted.")
//       // does not need to be escaped since we generate the name within the portfolio
//       post_args.snippet = req.file.path;
//       // we have the new file, delete the old one
//       if(req.body.editSnippet != undefined) {
//         // get the post using its ID
//         database.findPostById(req.body.id).then( post => {
//           logger.info("Editing snippet for post, deleting old one.");
//           fs.unlinkSync(post.snippet);
//         }).catch( err => {
//           logger.error(err);
//           next(err);
//         });
//       }
//     }
//     // place the arguments into a post obj
//     var to_edit = new Post(post_args);
//     // update the post using the post obj and it's ID
//     database.edit_post( to_edit.id, to_edit.export_to_db() ).then( post => {
//       res.redirect("/admin?edit=true");
//     }).catch(err => {
//       res.redirect("posts/posterror");
//     });
// });

// THIS SECTION ALL RELATES TO HANDLING REQUESTS FOR LOGGING IN / CONFIRMING IDENTITY
// get request to logout
app.get('/logout', function (req, res, next) {
  req.session.email = null;
  req.session.login = false;
  res.redirect('/');
});

// get request for login page
app.get("/admin", record, authenticate, function (req, res, next){
  // iterate over all the posts in the database
  database.getAllPosts({}).then( posts => {
    var all_posts = new Array();
    // TODO: Move this to the post class?
    // decode special characters in lists of posts
    posts.forEach(function(post, index, arr) {
      postArgs = { id: post.id, title: post.title, content: post.content, type: post.type };
      var tempPost = new Post(postArgs);
      all_posts.push(tempPost.export_to_view());
    });
    // get the visitor information as well and pass it to pug page
    database.queryForVisitors({}).then( visitors => {
      var all_visitors = new Array();
      visitors.forEach(function(visit, index, arr) {
        visitor_args = { id: visit._id, last_visit: visit.last_visit, first_visit: visit.first_visit, location_string: visit.location_string, ip: visit.ip, visits: visit.visits };
        var temp_visitor = new Visitor(visitor_args);
        temp_visitor.location.clean();
        all_visitors.push(temp_visitor.export_to_pug());
      });
      res.render('admin.pug', { visitors: all_visitors,
                                loggedin: req.session.login,
                                postdata: all_posts,
                                del: req.query.edit,
                                edit: req.query.delete});
      res.end();
    });
  });
});

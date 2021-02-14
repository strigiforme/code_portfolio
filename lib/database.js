/**

File: database.js
Author: Howard Pearce
Last Edit: Febuary 10, 2021
Description: Manages MONGODB database connections and sends queries

**/

var mongoose = require("mongoose");

module.exports = class Database {

  constructor(connection_uri) {
    this.mongodb = undefined;
    this.postSchema = undefined;
    this.adminSchema = undefined;
    this.postModel = undefined;
    this.adminModel = undefined;

    // connect to local db instance
    mongoose.connect(connection_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    // deprecated, disable to stop warnings
    mongoose.set('useFindAndModify', false);

    // get the database obj from the connection
    this.mongodb = mongoose.connection;
    this.mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // set up the schema and objects for the database
    this.postSchema = mongoose.Schema ({ title: String, type: String, snippet: String, content: String });
    this.adminSchema = mongoose.Schema ({ email: String });

    // set up models for objects we are using
    this.postModel = mongoose.model('Post', this.postSchema);
    this.adminModel = mongoose.model('Admin', this.adminSchema);

  }

  async getAdministrator() {

      let adminAccount;
      let newEmail;
      console.log("querying for administrator account");
      // get the administrator account's email
      const admins = await this.adminModel.find({});

      // check how many collections were returned
      if (admins.length > 1) {
        // there should only be one admin account. Log an error and move on.
        console.error("WARNING: More than one admin account is present. "
                      + "This currently should not be possible. Manual removal "
                      + "of 1 or more accounts should be performed. Selecting "
                      + "the first admin account in the collection.")

        // select the first one
        adminAccount = admins[0].email;

        console.log("INFO: Retrieved " + adminAccount +
                    " as administrator account email.")

      } else if (admins.length == 1) {
        // this is the expected case, return the email at index 0
        adminAccount = admins[0].email;
        // log the retrieved email
        console.log("INFO: Retrieved " + adminAccount + " as administrator account email.")
      } else {
        console.log("INFO: Unable to find an administrator account. In new Email mode.");
        newEmail = true;
        console.log(newEmail);
      }

      // return the extracted values
      return [adminAccount, newEmail];
  }

  find_posts(query) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, postModel=this.postModel ) => {
      // create a query for the post
      var post_query = postModel.find(query);
      // send the query
      post_query.exec().then( posts => {
          resolve(posts);
      }).catch( err => {
          reject(err);
      });
    });
  }

  // retrieve a post given its ID
  find_post(id) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, postModel=this.postModel ) => {
      // create a query for the post
      var post_query = postModel.findOne({ _id : id });
      // send the query
      post_query.exec().then( post => {
          resolve(post);
      }).catch( err => {
          reject(err);
      });
    });
  }

  async getAdminAccount(newEmail) {

    try {
      var adminAccount;

      // get the administrator account's email
      const admins = await database.admin_model.find({});

      // check how many collections were returned
      if (admins.length > 1) {
        // there should only be one admin account. Log an error and move on.
        console.error("WARNING: More than one admin account is present. "
                      + "This currently should not be possible. Manual removal "
                      + "of 1 or more accounts should be performed. Selecting "
                      + "the first admin account in the collection.")

        // select the first one
        adminAccount = admins[0].email;

        console.log("INFO: Retrieved " + adminAccount +
                    " as administrator account email.")

      } else if (admins.length == 1) {
        // this is the expected case, return the email at index 0
        adminAccount = admins[0].email;
        // log the retrieved email
        console.log("INFO: Retrieved " + adminAccount + " as administrator account email.")
      } else {
        console.log("INFO: Unable to find an administrator account. In new Email mode.");
        newEmail = true;
        console.log(newEmail);
      }

      // return the extracted values
      return [adminAccount, newEmail];

    } catch (error) {
      next(error);
    }

  }

  delete_post(id) {

  }

  edit_post(id) {

  }

  // method to handle posts failing to load - this seems like an ass backwards way to do this. Come back to it later.
  post_fail(res) {
    console.log("ERROR: Unable to find a post");
    res.render("posts/posterror.pug");
  }


  // Get and set methods -------------------------------------------------------

  get post_model() { return this.postModel; }

  get admin_model() { return this.adminModel; }

  get post_schema() { return this.postSchema; }

  get admin_schema() { return this.adminSchema; }

  get mongo_connection() { return this.mongodb; }

  set post_model(value) { this.postModel = value; }

  set admin_model(value) { this.adminModel = value; }

  set post_schema(value) { this.postSchema = value; }

  set admin_schema(value) { this.adminSchema = value; }

  set mongo_connection(value) { this.mongodb = value; }

}

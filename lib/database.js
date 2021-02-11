/**

File: database.js
Author: Howard Pearce
Last Edit: Febuary 4, 2021
Description: Manages MONGODB database connections and sends queries

**/

var mongoose = require("mongoose");

// connect to the local database instance
exports.connectDb = function() {
  // connect to local db instance
  mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

  // get the database obj from the connection
  var mongodb = mongoose.connection;

  // display connection errors
  mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

  // set up the schema and objects for the database
  const postSchema = mongoose.Schema ({ title: String, type: String, snippet: String, content: String });
  const adminSchema = mongoose.Schema ({ email: String });

  // set up models for objects we are using
  const Post = mongoose.model('Post', postSchema);
  const Admin = mongoose.model('Admin', adminSchema);

  // deprecated
  mongoose.set('useFindAndModify', false);

  return [Post, Admin];

}

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

  get post_model() {
    return this.postModel;
  }

  get admin_model() {
    return this.adminModel;
  }

  get post_schema() {
    return this.postSchema;
  }

  get admin_schema() {
    return this.adminSchema;
  }

  get mongo_connection() {
    return this.mongodb;
  }

  set post_model(value) {
    this.postModel = value;
  }

  set admin_model(value) {
    this.adminModel = value;
  }

  set post_schema(value) {
    this.postSchema = value;
  }

  set admin_schema(value) {
    this.adminSchema = value;
  }

  set mongo_connection(value) {
    this.mongodb = value;
  }

}

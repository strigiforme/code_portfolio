/**

File: database.js
Author: Howard Pearce
Last Edit: July 7, 2021
Description: Manages MONGODB database connections and sends queries

**/

const mongoose = require("mongoose")
const logger   = require("logger")
const fs       = require("fs")
const queries  = require("./queries")

class Database {

  constructor() {
    this.mongodb     = undefined;
    this.postSchema  = undefined;
    this.adminSchema = undefined;
    this.postModel   = undefined;
    this.adminModel  = undefined;
    this.documentModel = undefined;
  }

  /**
   * Connect and initialize the database
   * @param {String} uri The location of the database - must be a MONGODB instance
   */
  connect(uri) {
    return new Promise( async (resolve, reject) => {
      logger.info(`Connecting to MongoDB instance at: '${uri}'...`);
      let ctx = this;
      // connect to local db instance
      mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(()=>{
        // get the database obj from the connection
        ctx.mongodb = mongoose.connection;
        logger.info(`Connected successfully.`);
        // set up the schemas for the database - these represent the individual objects in mongodb
        ctx.documentSchema = mongoose.Schema ({ title: String, metadata: { date : Date, tags : String }, modules : [{ id : String, module_type : String, html : String, numInputs : Number, inputFields: [{type : String}], sanitized: Boolean}], sanitized : Boolean });
        ctx.postSchema = mongoose.Schema ({ title : String, type: String, snippet : String, content : String });
        ctx.adminSchema = mongoose.Schema ({ email : String });
        ctx.visitorSchema = mongoose.Schema ({ last_visit : Date, first_visit : Date, location_string : String, ip : String, visits : Number });
        // set up models - these represent the mongodb data stores for each type of object we want to store
        ctx.documentModel = mongoose.model('Document', ctx.documentSchema);
        ctx.postModel = mongoose.model('Post', ctx.postSchema);
        ctx.adminModel = mongoose.model('Admin', ctx.adminSchema);
        ctx.visitorModel = mongoose.model("Visitor", ctx.visitorSchema);
        resolve();
      }).catch( err => {
        reject(`Unable to connect database module. ${err}`);
      });
    });
  }

  /**
   * Disconnect the database
   */
   disconnect() {
     return mongoose.disconnect();
   }

  // Document related queries --------------------------------------------------

  createDocument(data) {
    logger.debug(`Attempting to create document in database`);
    return queries.create_record(data, this.documentModel);
  }

  findDocumentById(id) {
    logger.debug(`Attempting to query for single document with ID '${id}'`);
    return queries.find_single_record({ _id: id }, this.documentModel);
  }

  queryForDocuments(query) {
    logger.debug(`Attempting to query for documents using query: ${query}`)
    return queries.find_many_records(query, this.documentModel);
  }

  getAllDocuments() {
    return this.queryForDocuments({});
  }

  editDocument( id, data ) {
    logger.debug("Attempting to edit document");
    return queries.edit_record(id, data, this.documentModel);
  }

  // Post related Queries ------------------------------------------------------

  /**
   * Upload a new post object to MONGODB
   * @param {post} data The required data for a post object
   * @return {Promise} Promise object with upload result
   */
  createPost(data) {
    logger.debug(`Attempting to create post record: ${data}`);
    return queries.create_record(data, this.postModel);
  }

  /**
   * Returns all available posts - a wrapper for queryForPosts
   * @return {Promise} Promise object with all available posts in database
   */
  getAllPosts() {
    return this.queryForPosts({});
  }

  /**
   * Query for post stored within MONGODB
   * @param {map} query Information to query by. { _id: 102301234 } for example.
   * @return {Promise} Promise object with query result
   */
  queryForPosts(query) {
    logger.debug(`Attempting to query for posts using query: ${query}`)
    return queries.find_many_records(query, this.postModel);
  }

  /**
   * Retrieve a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @return {Promise} Promise object with result
   */
  findPostById(id) {
    logger.debug(`Attempting to query for single post with ID '${id}'`);
    return queries.find_single_record({ _id: id }, this.postModel);
  }

  /**
   * Modify a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @param {Post} new_post post object with update data
   * @return {Promise} Promise object with result
   */
  editPost(id, new_post) {
    logger.debug(`Attempting edit query for post with ID '${id}'`);
    return queries.edit_record({ _id : id }, new_post, this.postModel);
  }

  /**
   * Delete a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @return {Promise} Promise object with result
   */
  deletePost(id) {
    return new Promise(  ( resolve, reject, postModel=this.postModel ) => {
      // create a query to delete the post
      var delete_query = postModel.findOneAndDelete( { _id: id } );
      // send the query
      delete_query.exec().then( post => {
        // check if the post was found in the database
        if ( post != null ) {
          try {
            // remove the code snippet tied to this post if it exists
            if(post.snippet != undefined) {
              logger.info("post has a snippet, attempting deletion.");
              fs.unlinkSync(post.snippet);
            }
          } catch (err) {
            logger.error(`Unable to delete code snippet: ${err}`);
            reject(err);
          }
          logger.info(`Successfully deleted post with id '${id}'`);
          resolve(post);
        }
        reject(post);
      }).catch( err => {
        logger.error(`Unable to delete post with id '${id}'`);
        reject(err);
      });
    });
  }

  // Admin related Queries -----------------------------------------------------

  /**
   * Upload a new admin object to MONGODB
   * @param {String} email The email address of the admin account
   * @return {Promise} Promise object with upload result
   */
   createAdmin(email) {
     logger.debug(`Attempting to create admin with email: ${email}`);
     return queries.create_record({email: email}, this.adminModel);
   }

   /**
    * Query for admins stored within MONGODB
    * @param {map} query Information to query by. { _id: 102301234 } for example.
    * @return {Promise} Promise object with query result
    */
   queryForAdmins(query) {
     logger.debug(`Attempting to query for posts using query: ${query}`);
     return queries.find_many_records(query, this.adminModel);
   }

  /**
   * Retrieve the administrator account from MONGODB
   * @return {Promise} Promise object with admin account, and whether a new email is needed.
   */
  getAdminAccount() {
    var newEmail = false;
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, adminModel=this.adminModel ) => {
      // the email of the administator's account
      var adminAccount;
      // create a query to get all admin accounts
      var admin_query = adminModel.find({});
      // send the query
      admin_query.exec().then( admins => {
        if (admins.length > 1) {
          // there should only be one admin account. Log an warning and move on.
          logger.warning("More than one admin account is present. This currently should not be possible. "
          + "Manual removal of 1 or more accounts should be performed. Selecting the first admin account in the collection.")
          // select the first one
          adminAccount = admins[0].email;
          logger.info(`Retrieved ${adminAccount} as administrator account email.`)
        } else if (admins.length == 1) {
          // this is the expected case, return the email at index 0
          adminAccount = admins[0].email;
          logger.info(`Retrieved '${adminAccount}' as administrator account email.`)
        } else {
          logger.info("Unable to find an administrator account. In new Email mode.");
          newEmail = true;
        }
        // return the extracted values
        resolve({account:adminAccount, new:newEmail});
      }).catch( err => {
        reject(err);
      });
    });
  }
}

// The database is a singleton, so only want one instance to ever exist.
// Exporting the database like this handles it.
module.exports = new Database();

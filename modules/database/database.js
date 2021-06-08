/**

File: database.js
Author: Howard Pearce
Last Edit: June 8, 2021
Description: Manages MONGODB database connections and sends queries

**/

const mongoose = require("mongoose")
const logger   = require("logger")
const fs       = require("fs")

class Database {

  constructor() {
    this.mongodb     = undefined;
    this.post_schema  = undefined;
    this.admin_schema = undefined;
    this.post_model   = undefined;
    this.admin_model  = undefined;
  }

  /**
   * Connect and initialize the database
   * @param {String} uri The location of the database - must be a MONGODB instance
   */
  connect(uri) {
    logger.log_info(`Connecting to MongoDB instance at: '${uri}'...`);
    // connect to local db instance
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    // useFindAndModify is deprecated, disable it to stop warnings
    mongoose.set('useFindAndModify', false);

    // get the database obj from the connection
    this.mongodb = mongoose.connection;
    logger.log_info(`Connected successfully.`);
    // set up the schemas for the database - these represent the individual objects in mongodb
    this.post_schema = mongoose.Schema ({ title: String, type: String, snippet: String, content: String });
    this.admin_schema = mongoose.Schema ({ email: String });
    this.visitorSchema = mongoose.Schema ({ lastvisit: Date, firstvisit: Date, location_string: String, ip: String, visits: Number });
    // set up models - these represent the mongodb data stores for each type of object we want to store
    this.post_model = mongoose.model('Post', this.post_schema);
    this.admin_model = mongoose.model('Admin', this.admin_schema);
    this.visitorModel = mongoose.model("Visitor", this.visitorSchema);
  }

  /**
   * Upload a visitor object to MONGODB
   * @param {Visitor} data The required data for a visitor object
   * @return {Promise} Promise object with upload result
   */
  create_visitor(data) {
    return new Promise(  ( resolve, reject, visitorModel=this.visitorModel ) => {
      // create a query for the post
      var new_visitor = new visitorModel(data);
      // Using a callback here is inconsistent with the rest of the Software
      // I am feeling lazy right now, and this works well.
      new_visitor.save( ( err, post ) => {
          if (err) { reject(err); }
          logger.log_debug(`Successfully uploaded visitor with id: '${new_visitor._id}'`);
          resolve(new_visitor);
      });
    });
  }

  /**
   * Returns all available visitors - a wrapper for query_for_visitors
   */
  get_all_visitors(){
    return this.query_for_visitors({});
  }

  /**
   * Query for visitor(s) stored within MONGODB
   * @param {map} query Information to query by. { _id: 102301234 } for example.
   * @return {Promise} Promise object with query result
   */
  query_for_visitors(query) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, visitorModel=this.visitorModel ) => {
      // create a query for the post
      var visitor_query = visitorModel.find(query);
      // send the query
      visitor_query.exec().then( visitors => {
          resolve(visitors);
      }).catch( err => {
          reject(err);
      });
    });
  }


  /**
   * Retrieve a single visitor stored within MONGODB
   * @param {String} ip An IP to search for within MONGODB
   * @return {Promise} Promise object with result
   */
  find_visitor_by_ip(ip) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, visitorModel=this.visitorModel ) => {
      // create a query for the post
      var query = visitorModel.findOne({ ip : ip });
      // send the query
      query.exec().then( visitor => {
          resolve(visitor);
      }).catch( err => {
          reject(err);
      });
    });
  }

  /**
   * Modify a single visitor stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @param {Visitor} new_visitor visitor object with update data
   * @return {Promise} Promise object with result
   */
  edit_visitor(id, new_visitor) {
    return new Promise(  ( resolve, reject, visitorModel=this.visitorModel ) => {
      // create a query to edit the post
      var edit_query = visitorModel.findOneAndUpdate( { _id: id }, new_visitor );
      // send the query
      edit_query.exec().then( visitor => {
        logger.log_trace(`Successfully edited visitor with id: '${id}' and update data: ${new_visitor}`);
        resolve(visitor);
      }).catch( err => {
        logger.log_error(`Unable to edit visitor with id: '${id}': ${err}`);
        reject(err);
      });
    });
  }

  /**
   * Upload a new post object to MONGODB
   * @param {post} data The required data for a post object
   * @return {Promise} Promise object with upload result
   */
  create_post(data) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, post_model=this.post_model ) => {
      // create a query for the post
      var new_post = new post_model(data);
      // Using a callback here is inconsistent with the rest of the Software
      // I am feeling lazy right now, and this works well.
      new_post.save( ( err, post ) => {
          if (err) { reject(err); }
          logger.log_info(`Successfully uploaded post with id: '${new_post._id}'`);
          resolve(new_post);
      });
    });
  }

  /**
   * Returns all available posts - a wrapper for query_for_posts
   */
  get_all_posts() {
    return this.query_for_posts({});
  }

  /**
   * Query for post stored within MONGODB
   * @param {map} query Information to query by. { _id: 102301234 } for example.
   * @return {Promise} Promise object with query result
   */
  query_for_posts(query) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, post_model=this.post_model ) => {
      // create a query for the post
      var post_query = post_model.find(query);
      // send the query
      post_query.exec().then( posts => {
          resolve(posts);
      }).catch( err => {
          reject(err);
      });
    });
  }

  /**
   * Retrieve a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @return {Promise} Promise object with result
   */
  find_post_by_id(id) {
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, post_model=this.post_model ) => {
      // create a query for the post
      var post_query = post_model.findOne({ _id : id });
      // send the query
      post_query.exec().then( post => {
          resolve(post);
      }).catch( err => {
          reject(err);
      });
    });
  }

  /**
   * Retrieve the administrator account from MONGODB
   * @return {Promise} Promise object with admin account, and whether a new email is needed.
   */
  get_admin_account() {
    var newEmail = false;
    // return a promise for the caller to handle
    return new Promise(  ( resolve, reject, admin_model=this.admin_model ) => {
      // the email of the administator's account
      var adminAccount;
      // create a query to get all admin accounts
      var admin_query = admin_model.find({});
      // send the query
      admin_query.exec().then( admins => {
        if (admins.length > 1) {
          // there should only be one admin account. Log an warning and move on.
          logger.log_warning("More than one admin account is present. This currently should not be possible. "
          + "Manual removal of 1 or more accounts should be performed. Selecting the first admin account in the collection.")
          // select the first one
          adminAccount = admins[0].email;
          logger.log_info(`Retrieved ${adminAccount} as administrator account email.`)
        } else if (admins.length == 1) {
          // this is the expected case, return the email at index 0
          adminAccount = admins[0].email;
          logger.log_info(`Retrieved '${adminAccount}' as administrator account email.`)
        } else {
          logger.log_info("Unable to find an administrator account. In new Email mode.");
          newEmail = true;
        }
        // return the extracted values
        resolve({account:adminAccount, new:newEmail});
      }).catch( err => {
        reject(err);
      });
    });
  }

  /**
   * Delete a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @return {Promise} Promise object with result
   */
  delete_post(id) {
    return new Promise(  ( resolve, reject, post_model=this.post_model ) => {
      // create a query to delete the post
      var delete_query = post_model.findOneAndDelete( { _id: id } );
      // send the query
      delete_query.exec().then( post => {
        // check if the post was found in the database
        if ( post != null ) {
          try {
            // remove the code snippet tied to this post if it exists
            if(post.snippet != undefined) {
              logger.log_info("post has a snippet, attempting deletion.");
              fs.unlinkSync(post.snippet);
            }
          } catch (err) {
            logger.log_error(`Unable to delete code snippet: ${err}`);
            reject(err);
          }
          logger.log_info(`Successfully deleted post with id '${id}'`);
          resolve(post);
        }
        reject(post);
      }).catch( err => {
        logger.log_error(`Unable to delete post with id '${id}'`);
        reject(err);
      });
    });
  }

  /**
   * Modify a single post stored within MONGODB
   * @param {String} id An ID to search for within MONGODB
   * @param {Post} new_post post object with update data
   * @return {Promise} Promise object with result
   */
  edit_post(id, new_post) {
    return new Promise(  ( resolve, reject, post_model=this.post_model ) => {
      // create a query to edit the post
      var edit_query = post_model.findOneAndUpdate( { _id: id }, new_post );
      // send the query
      edit_query.exec().then( post => {
        logger.log_info(`Successfully edited post with id: '${id}' and update data: ${new_post}`);
        resolve(post);
      }).catch( err => {
        logger.log_error(`Unable to edit post with id: '${id}': ${err}`);
        reject(err);
      });
    });
  }
}

// The database is a singleton, so only want one instance to ever exist.
// Exporting the database like this handles it.
module.exports = new Database();

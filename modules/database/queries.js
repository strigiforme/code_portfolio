/**

File: Queries.js
Author: Howard Pearce
Last Edit: June 15, 2021
Description: Basic templates for queries to be used by database

**/


/**
 * Upload an object to MONGODB
 * @param {Object} data The required data for the object being uploaded
 * @param {Model} db_model The database model to run the query on. Defined in database.js
 * @return {Promise} Promise object with upload result
 */
var create_record = function(data, db_model) {
  // return a promise for the caller to handle
  return new Promise(  ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_entry = new model(data);
    // create a query for the object
    new_entry.save().then( data => {
        logger.log_trace(`Successfully uploaded record with id: '${new_entry._id}'`);
        resolve(new_entry);
    }).catch( err => {
      logger.log_error('Error occurred while uploading record.');
      reject(err);
    });
  });
}

/**
 * Retrieve a single object stored within MONGODB
 * @param {Query} query A set of parameters to query by. Should use a unique key to avoid multiple records being returned
 * @param {Model} db_model The database model to run the query on. Defined in database.js
 * @return {Promise} Promise object with result
 */
var find_single_record = function(query, db_model) {
  // return a promise for the caller to handle
  return new Promise( ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_query = model.findOne(query);
    // send the query
    new_query.exec().then( data => {
        logger.log_trace(`Successfully performed query for single record: ${new_query}`);
        resolve(data);
    }).catch( err => {
        logger.log_error('Error occurred performing query for single record.');
        reject(err);
    });
  });
}

/**
 * Retrieve many objects stored within MONGODB
 * @param {Query} query A set of parameters to query by.
 * @param {Model} db_model The database model to run the query on. Defined in database.js
 * @return {Promise} Promise object with result
 */
var find_many_records = function(query, db_model) {
  // return a promise for the caller to handle
  return new Promise( ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_query = model.find(query);
    // send the query
    new_query.exec().then( data => {
        logger.log_trace(`Successfully performed query for many records: ${new_query}`);
        resolve(data);
    }).catch( err => {
        logger.log_error('Error occurred performing query for many records.');
        reject(err);
    });
  });
}

/**
 * Retrieve many objects stored within MONGODB
 * @param {Query} query A set of parameters to query by.
 * @param {Object} data The new data to replace the old record
 * @param {Model} db_model The database model to run the query on. Defined in database.js
 * @return {Promise} Promise object with result
 */
var edit_record = function(query, new_data, db_model) {
 // return a promise for the caller to handle
 return new Promise ( ( resolve, reject, model=db_model ) => {
   var edit_query = model.findOneAndUpdate(query, new_data);
   edit_query.exec().then( data => {
     logger.log_trace(`Successfully performed edit query for record ${data}`);
     logger.log_trace(`New data is ${new_data}`);
     resolve(data);
   }).catch( err => {
     logger.log_error(`Error occurred while attempting edit query: ${query}`);
     reject(err);
   });
 });
}

/**
 * Delete a record stored within MONGODB
 * @param {Query} query A set of parameters to query by
 * @param {Model} db_model The database model to run the query on. Defined in databse.js
 */
var delete_record = function(query, db_model) {
  // return a promise for the caller to handle
  return new Promise ( ( resolve, reject, model=db_model) => {
    var delete_query = model.findOneAndDelete(query);
    delete_query.exec().then( data => {
      logger.log_trace(`Successfully performed delete query for record ${data}`);
      resolve(data);
    }).catch( err => {
      logger.log_error(`Error occurred while attempting delete query: ${query}`);
      reject(err);
    });
  });
}


exports.create_record       = create_record;
exports.find_single_record  = find_single_record;
exports.find_many_records   = find_many_records;
exports.edit_record         = edit_record;

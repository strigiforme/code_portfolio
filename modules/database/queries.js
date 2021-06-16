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
    // Using a callback here is inconsistent with the rest of the Software
    // I am feeling lazy right now, and this works well.
    new_entry.save( ( err, data ) => {
        if (err) { reject(err); }
        logger.log_trace(`Successfully uploaded record with id: '${new_entry._id}'`);
        resolve(new_entry);
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
  return new Promise(  ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_query = model.findOne(query);
    // send the query
    new_query.exec().then( data => {
        logger.log_trace(`Successfully performed query for single record: ${new_query}`);
        resolve(data);
    }).catch( err => {
        logger.log_trace('Error occurred performing query for single record.');
        reject(err);
    });
  });
}

var find_many_records = function(query, db_model) {
  // return a promise for the caller to handle
  return new Promise(  ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_query = model.find(query);
    // send the query
    new_query.exec().then( data => {
        logger.log_trace(`Successfully performed query for many records: ${new_query}`);
        resolve(data);
    }).catch( err => {
        logger.log_trace('Error occurred performing query for many records.');
        reject(err);
    });
  });
}

exports.create_record       = create_record;
exports.find_single_record  = find_single_record;
exports.find_many_records   = find_many_records;

/**

File: Queries.js
Author: Howard Pearce
Last Edit: June 15, 2021
Description: Basic templates for queries to be used by database

**/


/**
 * Upload a visitor object to MONGODB
 * @param {Visitor} data The required data for a visitor object
 * @return {Promise} Promise object with upload result
 */
var create_record = function(data, db_model) {
  return new Promise(  ( resolve, reject, model=db_model ) => {
    // create a query for the post
    var new_entry = new model(data);
    // Using a callback here is inconsistent with the rest of the Software
    // I am feeling lazy right now, and this works well.
    new_entry.save( ( err, data ) => {
        if (err) { reject(err); }
        logger.log_debug(`Successfully uploaded record with id: '${new_entry._id}'`);
        resolve(new_entry);
    });
  });
}

exports.create_record = create_record;

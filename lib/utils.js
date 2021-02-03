// Collection of utility one-off functions that can all go in the same file

var mongoose = require("mongoose");

exports.getAdminAccount = async function(Admin, newEmail) {

  try {
    var adminAccount;

    // get the administrator account's email
    const admins = await Admin.find({});

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

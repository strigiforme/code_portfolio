/**

File: accessCode.js
Author: Howard Pearce
Last Edit: February 20, 2022
Description: Handles generation and management of the application's access code.

**/

const fs = require('fs')
const crypto = require('crypto')
const prompt = require('prompt-sync')()
const logger = require('logger')

var accessCodeClass = class AccessCode {

  /**
   * @brief constructor
   * @param {String} accessCodePath the path to the access code file. Relative to root of project.
   */
  constructor (accessCodePath) {
    this.accessCodePath = accessCodePath
    this.accessCode = null
  }

  /**
   * Provided a code, generate a txt file with the hashed access code.
   * @throw {Error} If access code is empty or file cannot be created
   */
  createAccessCode () {
    // Does not use logger since this should be displayed no matter what
    console.log('Access code file does not exist yet.')
    console.log('You will be prompted to enter your access code, be sure to remember the code you provide. ')
    console.log('You will need it to log into the administrator account later, and it will not be accessible.')
    // Get the code from the user
    this.accessCode = prompt('Enter access code: ')

    if (this.accessCode.length < 1) {
      throw new Error('Access Code provided is less than 1 characters. Cannot continue.')
    } else {
      console.log('Access code received.')
    }

    // get the hashed access code
    var hash = crypto.createHash('sha256').update(this.accessCode).digest('hex')

    // write the hash to the access file
    fs.writeFile(this.accessCodePath, hash, function (err) {
      if (err) throw new Error(err)
    })
  }

  /**
   * Check if provided code matches hash in access file
   * @param {String} newCode The code to compare to the access file
   * @return {Promise<Boolean>} Whether or not the code matches
   * @throw {Error} If file could not be opened
   */
  compare (newCode) {
    return new Promise((resolve, reject) => {
      var hashcode = crypto.createHash('sha256').update(newCode).digest('hex')
      logger.info('Received access code. Converting to hashcode.')
      // get the code stored locally
      fs.readFile(this.accessCodePath, 'utf8', function (err, originalCode) {
        if (err) {
          reject(err)
        } else {
          // compare the submitted code to the stored one
          resolve(hashcode == originalCode)
        }
      })
    })
  }

  /**
   * Does the access file exist already?
   * @return {Boolean} If access file can be found
   */
  get accessFileExists () {
    return fs.existsSync(this.accessCodePath)
  }
}

module.exports = accessCodeClass

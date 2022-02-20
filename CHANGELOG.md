#### 3.0.0 (2022-01-12)

##### New Features

*  add routes for documents
*  prevent access code from being generated when it already exists 
*  Remove local.js. Not needed after development environment setup
*  Add more logging while server is initializing 
*  Add local version of portfolio for local debugging 
*  Update resume 
*  implement test base for database 
*  Added lots of functionality 
* **verification:**  add parameter to disable verification 
* **authenticator:**  add argument to disable security 
* **document:**
  *  add toString method 
  *  Submitted documents are now uploaded to database
  *  Each module created now has unique ID. All HTML elements within a module are labelled 
  *  add error check for bad html responses when retrieving module html 
  *  implement basic ajax request for dynamic document building 
  *  Remove empty constructor from moduleFactory
  *  Add pug resource for rendering documents 
  *  New mixins file, contains mixins used for modules 
* **database:**  Rename member variables to be camel case 
* **file_upload:**  Add 'any' file upload function to allow a dynamic amount of uploaded files 
* **ModuleFactory:**  Add static method for returning the required HTML inputs to generate a module by name 
* **views:**
  *  fix JS pathing so it is actually included
  *  Add empty create document page:
* **test:**
  *  fix Edit Document test in database test
  *  added full database test suite, added more database methods
  *  Add unit test suite for logger 
  * added two new testing suites for visitor and location data structures 
* **git:**  add package-log to gitignore
* **Document:**
  *  Add 'module_type' field to Module Object 
  *  Small bugfixes in constructors 
  *  Add image module to modulefactory 
  *  Able to load decode documents from database 
  *  Add export logic, able to save to database 
  *  create basic document functionality. Can render modules/documents 
* **Test:**
  *  Add database tests for document data structure 
  *  Add unit tests for authenticator 
* **Database:**
  *  Add ability to edit documents 
  *  add database method to create documents 
* **Authenticator:**  Add JavaDoc for Authenticator 
* **search:**
  *  beautified search interface, search results appear the same as the list of all posts. Need to add more search parameters in the future. 
  *  basic search results appear on screen, needs formatting 
  *  backend search functionality implemented 

##### Bug Fixes

* **test:**
  *  use corrected method name in database test
  *  remove wrongly added line causing test failure 
  *  create snippets file if not exist 
  *  add binary version to database test to avoid failure on gitlab 
* **Logger:**  Make logger easier to initialize and use 
*  Finish queries.js file, have abilility to edit, create and delete queries 
*  remove old lib folder, changing name to 'routes' 
*  file uploads now work, restructured core libraries to act as indvidual node modules 
* **database:**  remove old, unneeded code from database. Should work the same in less lines of code 

##### Refactors

* **document:**  Move unique module ID logic to moduleFactory
* **database:**
  *  change create_record method to use promises
  *  Move 'find' type queries over to queries.js
  *  Move query logic into seperate file 'queries.js' 
  *  change function names in database to be more specific and useful. Add some 'get_all_*' functions to query for all records easily. 
  *  connection logic moved to seperate method

## 2.0.0 (2021-10-01)

NOTE: I'm still getting used to managing a changelog. This could be MUCH better.

##### New Features

* **Authenticator:**  Add JavaDoc for Authenticator
* **Test:**  Add unit tests for authenticator
* **test:**
  *  added full database test suite, added more database methods 
  *  Add unit test suite for logger 
  *  added two new testing suites for visitor and location data structures 
*  implement test base for database 
* **Searching:**
  *  basic search results appear on screen, needs formatting 
  *  backend search functionality implemented

##### Bug Fixes

* **Testing:**
  *  remove wrongly added line causing test failure
  *  create snippets file if not exist 
  *  add binary version to database test to avoid failure on gitlab 
  *  modify tests to use new node modules 

##### Refactors
*  remove old lib folder, changing name to 'routes'
* **database:**  
  * remove old, unneeded code from database. Should work the same in less lines of code 
  * Finish queries.js file, have abilility to edit, create and delete queries 
* **Project Structure:**
  *  changed import paths for tests 
  *  Restructured core libraries to act as indvidual node modules
* **database:**
  *  change create_record method to use promises 
  *  Move 'find' type queries over to queries.js 
  *  Move query logic into seperate file 'queries.js' 
  *  change function names in database to be more specific and useful. Add some 'get_all_' functions to query for all records easily. 
  *  connection logic moved to seperate method

#### 1.0.0 (2021-05-02)

* Start of changelog. Many features are already implemented, and I'm in a refinement stage right now.

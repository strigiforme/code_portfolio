#### 2.1.0 (2022-01-12)

##### New Features

*  add routes for documents ([ff876e02](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ff876e028935fc42c3006f4494400b7c4a2a7e19))
*  prevent access code from being generated when it already exists ([7a7820df](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/7a7820df36b5181b90b6f4ea11b0babbcc1c35b5))
*  Remove local.js. Not needed after development environment setup ([f8eea65c](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f8eea65c475ff1e626bc6799d0efb10d1563d9c8))
*  Add more logging while server is initializing ([a5dbfdde](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/a5dbfddedc10e5d4331ff0f6c8c31bc81e5070e1))
*  Add local version of portfolio for local debugging ([5c1a9423](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/5c1a9423b3b4e355e67f5bc35716bb9b1b1dfcd7))
*  Update resume ([3c39e14f](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3c39e14f7573db5bd0dd455e0a79b71d2b709c2b))
*  implement test base for database ([efede7c1](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/efede7c1a40b016cb8f35f2fef4946b5b0d0dc70))
*  Added lots of functionality ([45b89109](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/45b8910937f054c03f94dac88265590beadd0076))
* **verification:**  add parameter to disable verification ([8ca14a8e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/8ca14a8ecda574afc66b2056dafc7762b3fb9766))
* **authenticator:**  add argument to disable security ([bafcb458](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/bafcb458ef1ed3f4f6213612add84ce466da9ece))
* **document:**
  *  add toString method ([babfd9b3](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/babfd9b3665cb8d846ec4b306c5ba21dd30865e4))
  *  Submitted documents are now uploaded to database ([66755957](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/66755957868315e787e50d91bf5de2d30717bc94))
  *  Each module created now has unique ID. All HTML elements within a module are labelled ([d3061e4e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/d3061e4ea33be2c4af5f096537981b5ce7ca3991))
  *  add error check for bad html responses when retrieving module html ([2904143a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2904143a20d26bdc9accb0319d683988fd389d15))
  *  implement basic ajax request for dynamic document building ([2d6da2bf](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2d6da2bfbe1e3c65170efb55969afbad8826291a))
  *  Remove empty constructor from moduleFactory ([cd62a11f](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/cd62a11ff8a9b058918be35aab5c3ee6bdf95ddf))
  *  Add pug resource for rendering documents ([6d0866c9](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/6d0866c92cdf4e5b1b8e1816c9622f84344d500e))
  *  New mixins file, contains mixins used for modules ([7ab72a65](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/7ab72a65a473d16b5af61add1478b0c9eba5986a))
* **database:**  Rename member variables to be camel case ([a0841799](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/a084179987dfb45b9a2d7e777ea2359371a3316e))
* **file_upload:**  Add 'any' file upload function to allow a dynamic amount of uploaded files ([aeaa7fc8](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/aeaa7fc831d50ee7ba592bea49d81e3f97096d27))
* **ModuleFactory:**  Add static method for returning the required HTML inputs to generate a module by name ([f12bf40a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f12bf40aa6d44f8a6f66c49f9685708d480af5e1))
* **views:**
  *  fix JS pathing so it is actually included ([63a677df](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/63a677dfedbd90a57228e2c2fd1c83011aa45624))
  *  Add empty create document page: ([e71a0005](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/e71a0005008711ecb2f3782669b4b289563303a6))
* **test:**
  *  fix Edit Document test in database test ([dcaa849d](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/dcaa849d386b5710962c46d816c16c5f81497b2a))
  *  added full database test suite, added more database methods ([8243d043](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/8243d04324cdc132b77c5676187527e7c82ae2fe))
  *  Add unit test suite for logger ([2249ade4](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2249ade4e64b5b4d7eab6149829f8ab3cd16fb47))
  * added two new testing suites for visitor and location data structures ([aa4223ef](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/aa4223efa0ca4684f7817f0c1f0587ceb27225b3))
* **git:**  add package-log to gitignore ([f522a4f4](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f522a4f4a419205109eab4d447dc284c08b1b1f7))
* **Document:**
  *  Add 'module_type' field to Module Object ([018a3fc3](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/018a3fc3dd37dd7429ea3d7dc3aedcfd8643fe4f))
  *  Small bugfixes in constructors ([9a30bbd4](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/9a30bbd483873cf6df4f738a1864b25bb0a57fe5))
  *  Add image module to modulefactory ([22a07516](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/22a07516dadb6f7045a099b41c3840c67f0d1933))
  *  Able to load decode documents from database ([1bda69de](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/1bda69deb90f9641ff48d232da85e8a215348302))
  *  Add export logic, able to save to database ([eed3063a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/eed3063af7f987357bcce856369b8b6a5deeddcd))
  *  create basic document functionality. Can render modules/documents ([73ea0122](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/73ea01228ea17ee8dae06ddd8594bb5e688e6037))
* **Test:**
  *  Add database tests for document data structure ([43d14a30](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/43d14a3051dc12f2f139bdc53af225b594ae3f5b))
  *  Add unit tests for authenticator ([d8bb392e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/d8bb392e5892491af44a46bd8af81d4b234e7929))
* **Database:**
  *  Add ability to edit documents ([ca5670a2](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ca5670a23a8aea47f898584214914d7fac82d455))
  *  add database method to create documents ([391ffcba](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/391ffcbaa06cd58182f6ba70a6baf28bf1e546ee))
* **Authenticator:**  Add JavaDoc for Authenticator ([f007b697](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f007b697029c5c801d1795fd13126cd295ef6a73))
* **search:**
  *  beautified search interface, search results appear the same as the list of all posts. Need to add more search parameters in the future. ([0141094c](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/0141094c2350a01a7d73fede0d9149c402e10658))
  *  basic search results appear on screen, needs formatting ([3c44b4ef](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3c44b4ef08453e482a563a6fa0fc82012f255e18))
  *  backend search functionality implemented ([6479a76a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/6479a76aed3b9fa6c5a77ab22d04870cc9e33828))

##### Bug Fixes

* **test:**
  *  use corrected method name in database test ([9c80a202](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/9c80a202bbab6677756a4f3e741d977eb9bd6e55))
  *  remove wrongly added line causing test failure ([1cf35032](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/1cf350322cf6f50c28705402a0c7630199ce5d53))
  *  create snippets file if not exist ([456b4d89](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/456b4d892d3724887d8082a29f82358ae65fec22))
  *  add binary version to database test to avoid failure on gitlab ([18a55ba3](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/18a55ba32ff9c67d0f82ca586d88a68954a15828))
* **Logger:**  Make logger easier to initialize and use ([f57bfb27](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f57bfb2750651a73eb33c40faee63f3dafd51a3c))
*  Finish queries.js file, have abilility to edit, create and delete queries ([a6aa2d7b](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/a6aa2d7b61b7b62945f787235eec0d230d774ade))
*  remove old lib folder, changing name to 'routes' ([ad969895](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ad969895c2fd3ecbe4e67c2ed0e09f076ac8bd3d))
*  file uploads now work, restructured core libraries to act as indvidual node modules ([3660c12a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3660c12aebd8271646d9901289faae7af01c355a))
* **database:**  remove old, unneeded code from database. Should work the same in less lines of code ([ebfabc75](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ebfabc75fcad4a06641d44fde49c2c6dae3b541b))
* **tests:**  modify tests to use new node modules ([82b35226](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/82b35226584c24d9442a4b56048511b471337cca))
* **structure:**
  *  changed import paths for tests ([34a04e49](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/34a04e496ff46578d998b6f9a4c2bde9af5afd7c))
  *  Divide core libraries into subfolders ([67cfdb27](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/67cfdb27c26afba5dde36f8fdb67c6a6a4d1bad0))

##### Other Changes

* //git.cs.dal.ca/hpearce/code_portfolio ([c0a08603](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/c0a086033a8ba7a63bbda9544b42e084acc3f67b))
*  	- snippetManager 	- Post object module ([3b9272a6](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3b9272a664b507bede7b2ec93a0212867b40b234))
* //git.cs.dal.ca/hpearce/3172 into master ([ef9bb34e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ef9bb34e2061e2725be6b42794150dc9b2964796))

##### Refactors

* **document:**  Move unique module ID logic to moduleFactory ([0acc70c6](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/0acc70c61b40eea095a1f680887ef7b2b95b12a7))
* **database:**
  *  change create_record method to use promises ([d6aad8c2](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/d6aad8c276beaba66443a1c698660c639dbe1dd6))
  *  Move 'find' type queries over to queries.js ([24bfa539](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/24bfa5399c06d08988a3496e1af7f6446ae60c67))
  *  Move query logic into seperate file 'queries.js' ([9d0ae785](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/9d0ae785e2eb77651ae25ec1cfa82c331b61330d))
  *  change function names in database to be more specific and useful. Add some 'get_all_*' functions to query for all records easily. ([50adcdcb](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/50adcdcbe8a99d544e1bdb152995f4cfb478f118))
  *  connection logic moved to seperate method ([2aa89866](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2aa89866ec2950cf45b22ef954373595c81d0dd7))

## 2.0.0 (2021-10-01)

NOTE: I'm still getting use to managing a changelog. This could be MUCH better.

##### New Features

* **Authenticator:**  Add JavaDoc for Authenticator ([f007b697](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/f007b697029c5c801d1795fd13126cd295ef6a73))
* **Test:**  Add unit tests for authenticator ([d8bb392e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/d8bb392e5892491af44a46bd8af81d4b234e7929))
* **test:**
  *  added full database test suite, added more database methods ([8243d043](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/8243d04324cdc132b77c5676187527e7c82ae2fe))
  *  Add unit test suite for logger ([2249ade4](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2249ade4e64b5b4d7eab6149829f8ab3cd16fb47))
  * added two new testing suites for visitor and location data structures ([aa4223ef](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/aa4223efa0ca4684f7817f0c1f0587ceb27225b3))
*  implement test base for database ([efede7c1](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/efede7c1a40b016cb8f35f2fef4946b5b0d0dc70))
*  Added lots of functionality ([45b89109](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/45b8910937f054c03f94dac88265590beadd0076))
* **search:**
  *  beautified search interface, search results appear the same as the list of all posts. Need to add more search parameters in the future. ([0141094c](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/0141094c2350a01a7d73fede0d9149c402e10658))
  *  basic search results appear on screen, needs formatting ([3c44b4ef](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3c44b4ef08453e482a563a6fa0fc82012f255e18))
  *  backend search functionality implemented ([6479a76a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/6479a76aed3b9fa6c5a77ab22d04870cc9e33828))

##### Bug Fixes

* **test:**
  *  remove wrongly added line causing test failure ([1cf35032](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/1cf350322cf6f50c28705402a0c7630199ce5d53))
  *  create snippets file if not exist ([456b4d89](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/456b4d892d3724887d8082a29f82358ae65fec22))
  *  add binary version to database test to avoid failure on gitlab ([18a55ba3](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/18a55ba32ff9c67d0f82ca586d88a68954a15828))
*  Finish queries.js file, have abilility to edit, create and delete queries ([a6aa2d7b](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/a6aa2d7b61b7b62945f787235eec0d230d774ade))
*  remove old lib folder, changing name to 'routes' ([ad969895](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ad969895c2fd3ecbe4e67c2ed0e09f076ac8bd3d))
*  file uploads now work, restructured core libraries to act as indvidual node modules ([3660c12a](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3660c12aebd8271646d9901289faae7af01c355a))
* **database:**  remove old, unneeded code from database. Should work the same in less lines of code ([ebfabc75](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ebfabc75fcad4a06641d44fde49c2c6dae3b541b))
* **tests:**  modify tests to use new node modules ([82b35226](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/82b35226584c24d9442a4b56048511b471337cca))
* **structure:**
  *  changed import paths for tests ([34a04e49](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/34a04e496ff46578d998b6f9a4c2bde9af5afd7c))
  *  Divide core libraries into subfolders ([67cfdb27](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/67cfdb27c26afba5dde36f8fdb67c6a6a4d1bad0))

##### Other Changes

* //git.cs.dal.ca/hpearce/code_portfolio ([c0a08603](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/c0a086033a8ba7a63bbda9544b42e084acc3f67b))
*  	- snippetManager 	- Post object module ([3b9272a6](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3b9272a664b507bede7b2ec93a0212867b40b234))
* //git.cs.dal.ca/hpearce/3172 into master ([ef9bb34e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ef9bb34e2061e2725be6b42794150dc9b2964796))

##### Refactors

* **database:**
  *  change create_record method to use promises ([d6aad8c2](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/d6aad8c276beaba66443a1c698660c639dbe1dd6))
  *  Move 'find' type queries over to queries.js ([24bfa539](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/24bfa5399c06d08988a3496e1af7f6446ae60c67))
  *  Move query logic into seperate file 'queries.js' ([9d0ae785](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/9d0ae785e2eb77651ae25ec1cfa82c331b61330d))
  *  change function names in database to be more specific and useful. Add some 'get_all_*' functions to query for all records easily. ([50adcdcb](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/50adcdcbe8a99d544e1bdb152995f4cfb478f118))
  *  connection logic moved to seperate method ([2aa89866](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/2aa89866ec2950cf45b22ef954373595c81d0dd7))

#### 1.0.0 (2021-05-02)

##### Other Changes

* //git.cs.dal.ca/hpearce/code_portfolio ([c0a08603](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/c0a086033a8ba7a63bbda9544b42e084acc3f67b))
*  	- snippetManager 	- Post object module ([3b9272a6](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/3b9272a664b507bede7b2ec93a0212867b40b234))
* //git.cs.dal.ca/hpearce/3172 into master ([ef9bb34e](https://git.cs.dal.ca/hpearce/code_portfolio.git/commit/ef9bb34e2061e2725be6b42794150dc9b2964796))

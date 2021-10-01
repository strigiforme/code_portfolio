## 2.0.0 (2021-10-01)

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


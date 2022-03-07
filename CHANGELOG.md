# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.1](https://github.com/strigiforme/code_portfolio/compare/v3.2.0...v3.2.1) (2022-03-07)


### Features

* **logger:** Add access modifiers to logger ([d46a75e](https://github.com/strigiforme/code_portfolio/commit/d46a75ef829c67c5e05ea15533c562f649a07e28))

## [3.2.0](https://github.com/strigiforme/code_portfolio/compare/v3.1.0...v3.2.0) (2022-03-03)


### Features

* **Logger:** Add colors corresponding to log level ([a4a233b](https://github.com/strigiforme/code_portfolio/commit/a4a233b41b882e9a3591e5b355d7e05464e92383))


### Bug Fixes

* **Logger:** Fix failing unit tests ([7ade3e1](https://github.com/strigiforme/code_portfolio/commit/7ade3e13c0090629e9f8d76d85a4e4d8b112cc40))

## [3.1.0](https://github.com/strigiforme/code_portfolio/compare/v3.0.0...v3.1.0) (2022-02-28)


### ⚠ BREAKING CHANGES

* API calls to AccessCodeManager must be made from
authenticator. API has been reduced

### Features

* **Authenticator:** Combine accessCode test suite ([5beb103](https://github.com/strigiforme/code_portfolio/commit/5beb10302cf25f630b67c8be56c1d44cbf7098e3))


* make AccessCodeManager subcomponent of Authenticator ([ddf1454](https://github.com/strigiforme/code_portfolio/commit/ddf145409524a69adcb7665db9d1c88f232dea2d))

## 3.0.0 (2022-02-20)


### Features

* **accessCodeManager:** convert access_code --> accessCode ([7367a34](https://github.com/strigiforme/code_portfolio/commit/7367a34267a9bf9393a113ea1e67939b55525b0a))
* **accessCodeManager:** convert to using camel case ([d9c5f76](https://github.com/strigiforme/code_portfolio/commit/d9c5f76d66ff8aa37baad827fd1d9a78c3bd5662))
* Add local version of portfolio for local debugging ([5c1a942](https://github.com/strigiforme/code_portfolio/commit/5c1a9423b3b4e355e67f5bc35716bb9b1b1dfcd7))
* Add more logging while server is initializing ([a5dbfdd](https://github.com/strigiforme/code_portfolio/commit/a5dbfddedc10e5d4331ff0f6c8c31bc81e5070e1))
* add package-lock.json to git ([432b2ac](https://github.com/strigiforme/code_portfolio/commit/432b2acbf20acdc23166fa19ff4f2c6bfea0c6ac))
* add routes for documents ([ff876e0](https://github.com/strigiforme/code_portfolio/commit/ff876e028935fc42c3006f4494400b7c4a2a7e19))
* Add standard-version module ([7e058c4](https://github.com/strigiforme/code_portfolio/commit/7e058c48b049c4788e5b326416c0e15066f356b9))
* Added lots of functionality ([45b8910](https://github.com/strigiforme/code_portfolio/commit/45b8910937f054c03f94dac88265590beadd0076))
* **authenticator:** add argument to disable security ([bafcb45](https://github.com/strigiforme/code_portfolio/commit/bafcb458ef1ed3f4f6213612add84ce466da9ece))
* **Authenticator:** Add JavaDoc for Authenticator ([f007b69](https://github.com/strigiforme/code_portfolio/commit/f007b697029c5c801d1795fd13126cd295ef6a73))
* **Database:** Add ability to edit documents ([ca5670a](https://github.com/strigiforme/code_portfolio/commit/ca5670a23a8aea47f898584214914d7fac82d455))
* **Database:** add database method to create documents ([391ffcb](https://github.com/strigiforme/code_portfolio/commit/391ffcbaa06cd58182f6ba70a6baf28bf1e546ee))
* **database:** convert to using camel case ([7e1393b](https://github.com/strigiforme/code_portfolio/commit/7e1393b1359486a719e859bd5cba60b9c85c576c))
* **database:** Rename member variables to be camel case ([a084179](https://github.com/strigiforme/code_portfolio/commit/a084179987dfb45b9a2d7e777ea2359371a3316e))
* Delete Posts from codebase ([19f88fa](https://github.com/strigiforme/code_portfolio/commit/19f88fa61e03bd8ab7c233c062d6a640e3f0bdee))
* **Document:** Able to load decode documents from database ([1bda69d](https://github.com/strigiforme/code_portfolio/commit/1bda69deb90f9641ff48d232da85e8a215348302))
* **Document:** Add 'module_type' field to Module Object ([018a3fc](https://github.com/strigiforme/code_portfolio/commit/018a3fc3dd37dd7429ea3d7dc3aedcfd8643fe4f))
* **document:** add error check for bad html responses when retrieving ([2904143](https://github.com/strigiforme/code_portfolio/commit/2904143a20d26bdc9accb0319d683988fd389d15))
* **Document:** Add export logic, able to save to database ([eed3063](https://github.com/strigiforme/code_portfolio/commit/eed3063af7f987357bcce856369b8b6a5deeddcd))
* **Document:** Add image module to modulefactory ([22a0751](https://github.com/strigiforme/code_portfolio/commit/22a07516dadb6f7045a099b41c3840c67f0d1933))
* **document:** Add pug resource for rendering documents ([6d0866c](https://github.com/strigiforme/code_portfolio/commit/6d0866c92cdf4e5b1b8e1816c9622f84344d500e))
* **document:** add toString method ([babfd9b](https://github.com/strigiforme/code_portfolio/commit/babfd9b3665cb8d846ec4b306c5ba21dd30865e4))
* **documentation:** Update package.json ([ec2c371](https://github.com/strigiforme/code_portfolio/commit/ec2c3711f4865c2f8d3e96d78881431001b51068))
* **Document:** create basic document functionality. Can render ([73ea012](https://github.com/strigiforme/code_portfolio/commit/73ea01228ea17ee8dae06ddd8594bb5e688e6037))
* **document:** Each module created now has unique ID. All HTML elements ([d3061e4](https://github.com/strigiforme/code_portfolio/commit/d3061e4ea33be2c4af5f096537981b5ce7ca3991))
* **document:** implement basic ajax request for dynamic document ([2d6da2b](https://github.com/strigiforme/code_portfolio/commit/2d6da2bfbe1e3c65170efb55969afbad8826291a))
* **document:** New mixins file, contains mixins used for modules ([7ab72a6](https://github.com/strigiforme/code_portfolio/commit/7ab72a65a473d16b5af61add1478b0c9eba5986a))
* **document:** Remove empty constructor from moduleFactory ([cd62a11](https://github.com/strigiforme/code_portfolio/commit/cd62a11ff8a9b058918be35aab5c3ee6bdf95ddf))
* **Document:** Small bugfixes in constructors ([9a30bbd](https://github.com/strigiforme/code_portfolio/commit/9a30bbd483873cf6df4f738a1864b25bb0a57fe5))
* **document:** Submitted documents are now uploaded to database ([6675595](https://github.com/strigiforme/code_portfolio/commit/66755957868315e787e50d91bf5de2d30717bc94))
* **file_upload:** Add 'any' file upload function to allow a dynamic ([aeaa7fc](https://github.com/strigiforme/code_portfolio/commit/aeaa7fc831d50ee7ba592bea49d81e3f97096d27))
* **fileUpload:** Convert file_upload --> fileUpload ([f5ff25f](https://github.com/strigiforme/code_portfolio/commit/f5ff25f437deaecfa10960da35c5cf2c27dfe569))
* **git:** add package-log to gitignore ([f522a4f](https://github.com/strigiforme/code_portfolio/commit/f522a4f4a419205109eab4d447dc284c08b1b1f7))
* implement test base for database ([efede7c](https://github.com/strigiforme/code_portfolio/commit/efede7c1a40b016cb8f35f2fef4946b5b0d0dc70))
* **Logger:** Change logger syntax to be more simple. Coverts to camel ([81b8905](https://github.com/strigiforme/code_portfolio/commit/81b8905f60692ced22f28c4c5d456900b51b75a9))
* **middleware:** convert to using camel case ([ff73662](https://github.com/strigiforme/code_portfolio/commit/ff73662bcd77d4e4099779a542ab3e49a67a3f97))
* **ModuleFactory:** Add static method for returning the required HTML ([f12bf40](https://github.com/strigiforme/code_portfolio/commit/f12bf40aa6d44f8a6f66c49f9685708d480af5e1))
* prevent access code from being generated when it already exists ([7a7820d](https://github.com/strigiforme/code_portfolio/commit/7a7820df36b5181b90b6f4ea11b0babbcc1c35b5))
* Remove IP Logger ([d449477](https://github.com/strigiforme/code_portfolio/commit/d449477ac7700981fca75d1ed5f16f8a1c41503f))
* Remove local.js. Not needed after development environment setup ([f8eea65](https://github.com/strigiforme/code_portfolio/commit/f8eea65c475ff1e626bc6799d0efb10d1563d9c8))
* **routes:** Convert to camel case ([66f2deb](https://github.com/strigiforme/code_portfolio/commit/66f2deb5cae7812e652770c3ede1a3f6aa546576))
* **search:** backend search functionality implemented ([6479a76](https://github.com/strigiforme/code_portfolio/commit/6479a76aed3b9fa6c5a77ab22d04870cc9e33828))
* **search:** basic search results appear on screen, needs formatting ([3c44b4e](https://github.com/strigiforme/code_portfolio/commit/3c44b4ef08453e482a563a6fa0fc82012f255e18))
* **search:** beautified search interface, search results appear the ([0141094](https://github.com/strigiforme/code_portfolio/commit/0141094c2350a01a7d73fede0d9149c402e10658))
* **Test:** Add database tests for document data structure ([43d14a3](https://github.com/strigiforme/code_portfolio/commit/43d14a3051dc12f2f139bdc53af225b594ae3f5b))
* **test:** Add unit test suite for logger ([2249ade](https://github.com/strigiforme/code_portfolio/commit/2249ade4e64b5b4d7eab6149829f8ab3cd16fb47))
* **Test:** Add unit tests for authenticator ([d8bb392](https://github.com/strigiforme/code_portfolio/commit/d8bb392e5892491af44a46bd8af81d4b234e7929))
* **test:** added full database test suite, added more database methods ([8243d04](https://github.com/strigiforme/code_portfolio/commit/8243d04324cdc132b77c5676187527e7c82ae2fe))
* **test:** Convert to Camel Case ([c88efad](https://github.com/strigiforme/code_portfolio/commit/c88efad257ca8fcfeba8cbe94d7eea5dbde5c835))
* **test:** fix Edit Document test in database test ([dcaa849](https://github.com/strigiforme/code_portfolio/commit/dcaa849d386b5710962c46d816c16c5f81497b2a))
* Update resume ([3c39e14](https://github.com/strigiforme/code_portfolio/commit/3c39e14f7573db5bd0dd455e0a79b71d2b709c2b))
* update version number ([648ca47](https://github.com/strigiforme/code_portfolio/commit/648ca470a0e0b1482b2ccedd17246a35f9786084))
* **verification:** add parameter to disable verification ([8ca14a8](https://github.com/strigiforme/code_portfolio/commit/8ca14a8ecda574afc66b2056dafc7762b3fb9766))
* **views:** Add empty create document page: ([e71a000](https://github.com/strigiforme/code_portfolio/commit/e71a0005008711ecb2f3782669b4b289563303a6))
* **views:** fix JS pathing so it is actually included ([63a677d](https://github.com/strigiforme/code_portfolio/commit/63a677dfedbd90a57228e2c2fd1c83011aa45624))


### Bug Fixes

* **database:** Fix for mongoose version 6 ([d6778ae](https://github.com/strigiforme/code_portfolio/commit/d6778ae198f97ac1a9f829a8fe33eafeed5f67aa))
* **database:** remove old, unneeded code from database. Should work the ([ebfabc7](https://github.com/strigiforme/code_portfolio/commit/ebfabc75fcad4a06641d44fde49c2c6dae3b541b))
* file uploads now work, restructured core libraries to act as ([3660c12](https://github.com/strigiforme/code_portfolio/commit/3660c12aebd8271646d9901289faae7af01c355a))
* Finish queries.js file, have abilility to edit, create and delete ([a6aa2d7](https://github.com/strigiforme/code_portfolio/commit/a6aa2d7b61b7b62945f787235eec0d230d774ade))
* **Logger:** Make logger easier to initialize and use ([f57bfb2](https://github.com/strigiforme/code_portfolio/commit/f57bfb2750651a73eb33c40faee63f3dafd51a3c))
* remove old lib folder, changing name to 'routes' ([ad96989](https://github.com/strigiforme/code_portfolio/commit/ad969895c2fd3ecbe4e67c2ed0e09f076ac8bd3d))
* **structure:** changed import paths for tests ([34a04e4](https://github.com/strigiforme/code_portfolio/commit/34a04e496ff46578d998b6f9a4c2bde9af5afd7c))
* **structure:** Divide core libraries into subfolders ([67cfdb2](https://github.com/strigiforme/code_portfolio/commit/67cfdb27c26afba5dde36f8fdb67c6a6a4d1bad0))
* **test:** add binary version to database test to avoid failure on ([18a55ba](https://github.com/strigiforme/code_portfolio/commit/18a55ba32ff9c67d0f82ca586d88a68954a15828))
* **test:** create snippets file if not exist ([456b4d8](https://github.com/strigiforme/code_portfolio/commit/456b4d892d3724887d8082a29f82358ae65fec22))
* **test:** remove wrongly added line causing test failure ([1cf3503](https://github.com/strigiforme/code_portfolio/commit/1cf350322cf6f50c28705402a0c7630199ce5d53))
* **tests:** modify tests to use new node modules ([82b3522](https://github.com/strigiforme/code_portfolio/commit/82b35226584c24d9442a4b56048511b471337cca))
* **test:** use corrected method name in database test ([9c80a20](https://github.com/strigiforme/code_portfolio/commit/9c80a202bbab6677756a4f3e741d977eb9bd6e55))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

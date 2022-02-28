/**

File: authenticator.test.js
Author: Howard Pearce
Last Edit: August 28, 2021
Description: Test suite for authenticator.js

**/

const fs = require('fs')
var authenticator = require('authenticator')
var { MongoMemoryServer } = require('mongodb-memory-server')
var database = require('database')

// need a long timeout to download binaries
jest.setTimeout(20000)
// create mongodb database in memory to test on
mongod = new MongoMemoryServer({binary: {version: '5.0.1'}})

// testing variables
test_email = 'test@test.com'

beforeAll(async () => {
  // Refresh and connect to mongodb instance synchronously
  await mongod.start()
  const uri = mongod.getUri()
  await database.connect(uri)
})

afterAll(async () => {
  // Disconnect from mongodb instance synchronously
  await database.disconnect()
  await mongod.stop()
})

test('Authenticator has correct default values.', () => {
  expect(authenticator.adminExists).toBe(false)
  expect(authenticator.admin).toBe(undefined)
  expect(authenticator.accessCodeValid).toBe(false)
  expect(authenticator.doAddAdmin).toBe(false)
})

test('Authenticator enters new email mode if no admin account is found.', async () => {
  // get the authenticator to fetch the admin account
  await authenticator.initialize()
  expect(authenticator.admin).toBe(undefined)
  expect(authenticator.doAddAdmin).toBe(true)
  expect(authenticator.adminExists).toBe(false)
})

test('Authenticator checks for administrator account.', async () => {
  // Insert a fake admin record for the authenticator to use
  await database.createAdmin(test_email)
  // get the authenticator to fetch the admin account
  await authenticator.initialize()
  // verify we are in correct starting state
  expect(authenticator.admin).toBe(test_email)
  expect(authenticator.doAddAdmin).toBe(false)
  expect(authenticator.adminExists).toBe(true)
})

test('Test Create Access Code', async () => {
  await authenticator.accessCode.createAccessCode({ providedCode: 'test' })
  // does the authenticator think that the access code exists?
  expect(authenticator.accessCode.accessFileExists).toBe(true)
  // does it really exist?
  expect(fs.existsSync(authenticator.accessCode.accessCodePath)).toBe(true)
})

test('Test Access Code fails for small string', () => {
  expect(() => {
    authenticator.accessCode.createAccessCode({ code: '' })
  }).toThrow()
})

test('Test Access Code fails for large string', () => {
  expect(() => {
    authenticator.accessCode.createAccessCode({ code: 'x'.repeat(101) })
  }).toThrow()
})

test('Test Check Access', () => {
  // case where access code matches
  authenticator.accessCode.compare('test').then(result => {
    expect(result).toBe(true)
  })
  // case where access code doesn't match
  authenticator.accessCode.compare('bad_value').then(result => {
    expect(result).toBe(false)
  })
})

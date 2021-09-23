var logger       = require("logger")
var factory = require("./module_factory.js")
var Document = require("./document")
logger.initialize()

var mod = factory.create_module("paragraph")
console.log(mod)
mod.add_input("hello!")
console.log(mod.render())
console.log(mod)

var newDoc = new Document({title: "test"})
newDoc.addModule(mod)
console.log(newDoc.render())

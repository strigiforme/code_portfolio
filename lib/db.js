var mongoose = require("mongoose");

// connect to the local database instance
exports.connectDb = function() {
  // connect to local db instance
  mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

  // get the database obj from the connection
  var mongodb = mongoose.connection;

  // display connection errors
  mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

  // set up the schema and objects for the database
  const postSchema = mongoose.Schema ({ title: String, type: String, content: String });
  const adminSchema = mongoose.Schema ({ email: String });

  // set up models for objects we are using
  const Post = mongoose.model('Post', postSchema);
  const Admin = mongoose.model('Admin', adminSchema);

  // deprecated
  mongoose.set('useFindAndModify', false);

  return [Post, Admin];

}

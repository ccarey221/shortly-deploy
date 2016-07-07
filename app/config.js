var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);


var mongoose = require('mongoose');

mongoose.connect('mongodb://root:zepartystick@107.170.202.49:4568');
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'mdb connection error:'));
mdb.once('open', function() {
  // we're connected!
});

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);
var newUser = new User({username: 'Stan', password: 'flan'});
newUser.save(function(err, obj) {
  if (err) { throw err; }

});
User.find(function(err, users) {
  if (err) { throw err; }
  console.log('Found Users: ', users);
});


db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;

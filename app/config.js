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

mongoose.connect('mongodb://localhost/shortlyDB');
var db = mongoose;

db.connection.on('error', console.error.bind(console, 'mdb connection error:'));
db.connection.once('open', function() {
  // we're connected!
  console.log('Mongoose connection Open');
});


module.exports = db;

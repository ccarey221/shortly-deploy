var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var UserSchema = new db.Schema({
  username: String,
  password: String
});

UserSchema.pre('save', function(next) {
  this.hashPassword(next);
});

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

UserSchema.methods.hashPassword = function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
      next();
    });
};
var User = db.model('User', UserSchema);

module.exports = User;

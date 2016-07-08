var db = require('../config');
var crypto = require('crypto');

var urlSchema = db.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
});

var Link = db.model('url', urlSchema);

module.exports = Link;
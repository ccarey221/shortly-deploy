var db = require('../config');
var crypto = require('crypto');

var urlSchema = db.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

urlSchema.methods.initialize = function() {
  this.on('creating', function(model, attrs, options) {
    shasum.update(model.get('url'));
    var shasum = crypto.createHash('sha1');
    model.set('code', shasum.digest('hex').slice(0, 5));
  });
};

var Link = db.model('url', urlSchema);

module.exports = Link;
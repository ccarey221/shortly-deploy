var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {

  Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.find({url: uri}, function(err, data) {
    if (data.length) {
      res.status(200).send(data);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        });
        newLink.save(function(err, newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
};



exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username },
    function(err, user) {
      if (!user || err) {
        console.log('No User');
        res.redirect('/login');
      } else {
        console.log('comparePassword');
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            console.log('No match');
            res.redirect('/login');
          }
        });
      }
    });
};


exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, user) {
    if (!user.length) {
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.save().then(function(newUser) {
        console.log('Signup newuser: ', newUser);
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};


exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      console.log('Nav Error: ', err);
      res.redirect('/');
    } else if (link) {
      link.set({ visits: link.get('visits') + 1 })
        .save(function() {
          return res.redirect(link.get('url'));
        });
    } else {
      res.redirect('/');
    }
  });
};
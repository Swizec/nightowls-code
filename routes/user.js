
/*
 * GET users listing.
 */

var github = require('octonode'),
    secrets = require('../secrets');

exports.list = function(req, res){
  res.send("respond with a resource");
};

var auth_url = github.auth.config({
    id: secrets.client_id,
    secret: secrets.client_secret
}).login();

exports.login = function(req, res) {
    if (req.param('contribute-data')) {
        req.session.contribute_data = true;
    }
    res.redirect(301, auth_url);
};

exports.auth = function (req, res) {
    github.auth.login(req.param('code'), function (err, token) {
        req.session.token = token;
        res.redirect("/");
    });

};

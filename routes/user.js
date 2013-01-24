
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
}).login([]);

exports.login = function(req, res) {
    console.log(auth_url+'&redirect_uri=http://nightowls.swizec.com/auth');
    res.redirect(301, auth_url+'&redirect_uri=http://nightowls.swizec.com/auth');
};

exports.auth = function (req, res) {
    github.auth.login(req.param('code'), function (err, token) {
        req.session.token = token;
        res.redirect("/");
    });

};

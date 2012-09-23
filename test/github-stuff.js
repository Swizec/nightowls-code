
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var github = require('octonode'),
    secrets = require('../secrets.js');

describe('Github', function () {
    console.log(secrets);
    var client = github.client({username: secrets.test_username,
                                password: secrets.test_password});
    
    var ghme = client.me();

    ghme.repos(function (err, data) {
        console.log("error: ", err);
        console.log("data: ", data);
    });
    
});

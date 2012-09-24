
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var github = require('octonode'),
    fetching = require('../lib/fetching.js'),
    secrets = require('../secrets.js');

describe('Github', function () {
    var client = github.client({username: secrets.test_username,
                                password: secrets.test_password});

    it('should fetch repos', function (done) {
        
        fetching.repositories(client, function (err, repos) {
            repos.should.have.length(18);
            done();
        });
                
    });

});

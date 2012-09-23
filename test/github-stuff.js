
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var github = require('octonode'),
    secrets = require('../secrets.js');

describe('Github', function () {
    var client = github.client({username: secrets.test_username,
                                password: secrets.test_password});
    
    var ghme = client.me();

    it('should get repo', function (done) {
        ghme.repos(function (err, data) {
            var repos = data.map(function (repo) {
                return repo.full_name;
            });
            
            var ghrepo = client.repo('Swizec/HipsterVision');

            ghrepo.commits(function (err, data) {
                var commits = data.filter(function (commit) {
                    return commit.author.login === 'Swizec';
                });

                console.log(commits.length);

                done();
            });

        });
    });
});

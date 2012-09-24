
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var github = require('octonode'),
    async = require('async'),
    _ = require('underscore'),
    secrets = require('../secrets.js');

describe('Github', function () {
    var client = github.client({username: secrets.test_username,
                                password: secrets.test_password});

    it('should fetch repos', function (done) {
        
        var ghme = client.me();
        
        ghme.repos(function (err, data) {
            var repos = data.map(function (repo) {
                return repo.full_name;
            });

            async.filter(repos,
                      function (repo, callback) {
                          var ghrepo = client.repo(repo);
                          ghrepo.contributors(function (err, data) {
                              if (err) return callback(false);

                              var sum = function (coll) {
                                  return _.reduce(
                                      coll.map(
                                          function (contributor) {
                                              return contributor.contributions;
                                          }),
                                      function (memo, num) { return memo+num;},
                                      0);
                              };

                              var mine = data.filter(
                                  function (contributor) {
                                      return contributor.login === 'Swizec';
                                  });
                              
                              var percent = sum(mine)/sum(data);

                              return callback(percent > 0.80);
                          });
                      },
                      function (results) {
                          console.log(results);
                          done();
                      });

        });
        
    });

});

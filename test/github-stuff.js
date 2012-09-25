
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
            repos.should.have.length(19);
            done();
        });
                
    });

    it('should fetch punchcards', function (done) {

        fetching.punchcard(['Swizec/750words-analysis', 'Swizec/compilers-homework',
                            'Swizec/checkbox-field', 'Swizec/HipsterVision'],
                            function (err, data) {
                                data.should.have.length(7*24);
                                done();
                            });
    });

    it('should cache things', function (done) {
        
        fetching.full_punchcard("Swizec", function (err, data) {
            var t1 = new Date().getTime();

            fetching.full_punchcard("Swizec", function (err, data) {
                var t2 = new Date().getTime(),
                    delta = t2-t1;

                require('assert').ok(delta<1000, "Too slow");

                done();

            });
        });

    });

});

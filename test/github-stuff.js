
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var githubApi = require('github'),
    github = new githubApi({version: "3.0.0"});
    secrets = require('../secrets.js');

describe('Github', function () {
    it('should get all commits', function (done) {
        var page = function (n, callback) {
            console.log(n);
            github.repos.getCommits({user: 'Swizec',
                                     repo: 'dot.emacs.d',
                                     per_page: 100},
                                    function (err, data) {
                                        console.log("err", err);
                                        console.log("L", data.length);
                                        if (err) return callback(err);
                                        
                                        if (data.length < 100) {
                                            callback(err, data);
                                        }else{
                                            page(n+1, function (err, data2) {
                                                callback(err, data.concat(data2));
                                            });
                                        }
                                    });
        };

        page(0, function (err, data) {
            console.log("err", err);
            console.log("data", data.length);
        });
        
/*        github.repos.getCommits({user: 'swizec@swizec.com',
                                 repo: 'HipsterVision',
                                 per_page: 100},
                                function (err, data) {

                                    console.log("err", err);
                                    console.log("data", data);
                                    
                                    done();

                                });*/
    });
});

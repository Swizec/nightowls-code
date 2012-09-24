
var request = require('superagent'),
    async = require('async'),
    github = require('octonode'),
    _ = require('underscore'),
    secrets = require('../secrets');

var repositories = exports.repositories = function (client, callback) {

    var ghme = client.me();

    ghme.info(function (err, info) {   
        ghme.repos(function (err, data) {
            if (err) return callback(err);

            var repos = data.map(function (repo) {
                return repo.full_name;
            });
            
            repo_candidates(client, info.login, repos, 
                            function (repos) { callback(null, repos); });
        });
    });

};

var punchcard = exports.punchcard = function (repos, callback) {
    
    async.map(repos,
              function (repo, callback) {
                  var url = 'https://github.com/'+repo+'/graphs/punch-card-data';
                  request.get(url, 
                              function (res) {
                                  if (res.status === 200) {
                                      //console.log(url);
                                      callback(null, res.body);
                                  }else{
                                      // TODO: handle 202 
                                      //console.log("status", res.status);
                                      callback(new Error('Punchcard problem'));
                                  }
                              });
              },
              function (err, punchcards) {
                  callback(err, merge_punchcards(punchcards));
              });
};

exports.full_punchcard = function (username, callback) {
    var client = github.client({username: secrets.test_username,
                                password: secrets.test_password});

    repositories(client, function (err, repos) {
        if (err) return callback(err);

        punchcard(repos, callback);
    });
};


var repo_candidates = function (client, me, repos, callback) {
    async.filter(repos,
                 function (repo, callback) {
                     var ghrepo = client.repo(repo);
                     ghrepo.contributors(function (err, data) {
                         if (err) return callback(false);                        
                        
                         var mine = data.filter(
                             function (contributor) {
                                 return contributor.login === me;
                             });
                         
                         var percent = sum(mine)/sum(data);
                         
                         return callback(percent > 0.80);
                     });
                 },
                 function (results) {
                     callback(results);
                 });

    var sum = function (coll) {
        return _.reduce(
            coll.map(
                function (contributor) {
                    return contributor.contributions;
                }),
            function (memo, num) { return memo+num;},
            0);
    };
    
};


var merge_punchcards = function (punchcards) {
    var result = {};
    var d, h;

    // entry is [day, hour, commits]

    for (d = 0; d < 7; d++) {
        result[d] = {};
        for (h = 0; h < 24; result[d][h++] = 0) {}
    }

    var i = 0;
    punchcards.map(function (punchcard) {
        if (punchcard) {
            punchcard.map(function (entry) {
                result[entry[0]][entry[1]] += entry[2];
            });
        }
    });

    var _result = [];
    for (d = 0; d < 7; d++) {
        for (h = 0; h < 24; h++) {
            _result.push([d, h, result[d][h]]);
        }
    }

    return _result;
};

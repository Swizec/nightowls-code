
var request = require('superagent'),
    async = require('async'),
    _ = require('underscore');

exports.repositories = function (client, callback) {

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

exports.punchcards = function (repos, callback) {
    
    async.map(repos,
              function (repo, callback) {
                  request.get('https://github.com/'+repo+'/graphs/punch-card-data', 
                              function (res) {
                                  if (res.status === 200) {
                                      callback(null, res.body);
                                  }else{
                                      callback(new Error('Punchcard problem'));
                                  }
                              });
              },
              function (err, punchcards) {
                  callback(err, merge_punchcards(punchcards));
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

    punchcards.map(function (punchcard) {
        punchcard.map(function (entry) {
            result[entry[0]][entry[1]] += entry[2];
        });
    });

    var _result = [];
    for (d = 0; d < 7; d++) {
        for (h = 0; h < 24; h++) {
            _result.push([d, h, result[d][h]]);
        }
    }

    return _result;
};

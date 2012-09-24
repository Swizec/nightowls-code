
var async = require('async'),
    _ = require('underscore');

exports.repositories = function (client, callback) {

    var ghme = client.me();

    ghme.info(function (err, info) {   
        ghme.repos(function (err, data) {
            if (err) return callback(err);
            
            var repos = data.map(function (repo) {
                return repo.full_name;
            });
            
            pick_candidates(client, info.login, repos, 
                            function (repos) { callback(null, repos); });
        });
    });

};


var pick_candidates = function (client, me, repos, callback) {
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


var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    db = new Db('punchcards', Server('localhost', 27017, {auto_reconnect: true}));


db.open(function (err, db) {
    exports.save = function (username, token, data, callback) {
        if (err) return callback(err);

        db.collection('punchcards', function (err, punchcards) {
            if (err) return callback(err);
            
            punchcards.update({username: username},
                              {token: token,
                               username: username,
                               data: data},
                              {safe: true,
                               upsert: true},
                              function (err) {
                                  callback(err);
                              });
        });
    };

    exports.get = function (username, callback) {
        if (err) return callback(err);
        
        db.collection('punchcards', function (err, punchcards) {
            if (err) return callback(err);

            punchcards.findOne({username: username}, callback);
        });
    };

});

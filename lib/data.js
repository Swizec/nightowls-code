
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    db = new Db('punchcards', Server('localhost', 27017, {auto_reconnect: true}));


exports.save = function (username, token, data, callback) {
    db.open(function (err, db) {
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
    });
};

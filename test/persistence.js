
var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var data = require('../lib/data'),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    db = new Db('punchcards', Server('localhost', 27017, {auto_reconnect: true}));

describe('Data', function () {

    it('stores data', function (done) {
        db.open(function (err, db) {
            data.save('username', 'token', [['data']],
                      function () {
                          db.collection('punchcards', function (err, collection) {
                              collection.find({username: 'username'}).toArray(
                                  function (err, items) {
                                      var item = items[0];

                                      item.token.should.equal('token');
                                      item.username.should.equal('username');
                                      item.data.should.eql([['data']]);

                                      done();
                                  });
                          });
                      });
        });
    });

});

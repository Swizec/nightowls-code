
/*
 * GET home page.
 */

var fetching = require('../lib/fetching'),
    data = require('../lib/data'),
    github = require('octonode');

exports.index = function(req, res){
    var token = req.session.token;

    if (!token) {
        res.render('index', {title: 'When do you really code?',
                             showing_punchcard: false,
                             username: false});
    }else{
        github.client(token).me().info(function (err, info) {
            data.save(info.login, token, [], req.session.contribute_data || false,
                      function (err) {
                          res.redirect('/'+info.login);
                      });
        });
        //show_punchcard(true, token, req, res);
    }
};

exports.username = function (req, res) {
    data.get(req.param('username')[0],
             function (err, punchcard) {
                 if (!punchcard) {
                     res.send(404, "Don't have this yet :/");
                 }else{
                     show_punchcard(punchcard.token, req, res);
                 }
             });
};

exports.punchcard_data = function (req, res) {
    var serve = function (token) {
        fetching.full_punchcard(token, req.session.contribute_data || false,
                                function (err, punchcard) {
                                    res.send(punchcard);
                                });
    };

    if (req.param('username')) {
        data.get(req.param('username'), function (err, punchcard) {
            serve(punchcard.token);
        });
    }else if (req.session.token) {
        serve(req.session.token);
    }else{
        res.send([]);
    }
};

var show_punchcard = function (token, req, res) {
    res.render('index', 
               {title: 'When do you really code?',
                showing_punchcard: true,
                this_is_me: req.session.token === token,
                username: req.param('username', [])[0]});
};

exports.histogram = function (req, res) {
    res.render('histogram', {title: 'When do we code?',
                             showing_punchcard: true,
                             username: 'bla',
                             this_is_me: true});
};

exports.histogram_data = function (req, res) {
    res.send({ '0': 1236107,
               '1': 875481,
               '2': 618512,
               '3': 485753,
               '4': 390992,
               '5': 364368,
               '6': 508905,
               '7': 803830,
               '8': 1198888,
               '9': 1853548,
               '10': 2523715,
               '11': 2835032,
               '12': 2580509,
               '13': 2905688,
               '14': 3265814,
               '15': 3505687,
               '16': 3489700,
               '17': 3153522,
               '18': 2426503,
               '19': 2054529,
               '20': 2068566,
               '21': 2111502,
               '22': 1939938,
               '23': 1646964 });
};

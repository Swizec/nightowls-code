
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
            res.redirect('/'+info.login);
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
                     show_punchcard(false, punchcard.token, req, res);
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

var show_punchcard = function (me, token, req, res) {
    res.render('index', 
               {title: 'When do you really code?',
                showing_punchcard: true,
                this_is_me: me,
                username: req.param('username', [])[0]});
};

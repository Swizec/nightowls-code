
/*
 * GET home page.
 */

var fetching = require('../lib/fetching'),
    data = require('../lib/data');

exports.index = function(req, res){
    var token = req.session.token;

    if (!token) {
        res.render('index', {title: 'When do you really code?',
                             punchcard: [],
                             showing_punchcard: false});
    }else{
        show_punchcard(true, token, req, res);
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

var show_punchcard = function (me, token, req, res) {
    fetching.full_punchcard(token, req.session.contribute_data || false, 
                            function (err, punchcard) {

                                res.render('index', 
                                           {title: 'When do you really code?',
                                            punchcard: JSON.stringify(punchcard),
                                            showing_punchcard: true,
                                            this_is_me: me});
                            });
};

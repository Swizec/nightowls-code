
/*
 * GET home page.
 */

var fetching = require('../lib/fetching');

exports.index = function(req, res){
    var token = req.session.token;

    if (!token) {
        res.render('index', {title: 'When do you really code?',
                             punchcard: []});
    }else{
        fetching.full_punchcard(token, function (err, punchcard) {
            res.render('index', { title: 'When do you really code?',
                                  punchcard: JSON.stringify(punchcard)});
        });
    }
};

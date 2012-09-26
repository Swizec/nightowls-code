
/*
 * GET home page.
 */

var fetching = require('../lib/fetching');

exports.index = function(req, res){
    var token = req.session.token;

    if (!token) {
        res.redirect("/login");
    }else{
        fetching.full_punchcard(token, function (err, punchcard) {
            res.render('index', { title: 'Express',
                                  punchcard: JSON.stringify(punchcard)});
        });
    }
};


/*
 * GET home page.
 */

var fetching = require('../lib/fetching');

exports.index = function(req, res){
    console.log("FETCHING");
    fetching.full_punchcard('', function (err, punchcard) {
        res.render('index', { title: 'Express',
                              punchcard: JSON.stringify(punchcard)});
    });
};

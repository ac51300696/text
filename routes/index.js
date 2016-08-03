exports.article = require('./article');
exports.user = require('./user');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
	//console.log(req.models)
  req.models.Article.find({published: true},null,{sort: {_id:-1}},function(error, articles){
     console.log('index')
    if (error) {return next(error); console.log(error)}
    res.render('index', { articles: articles});

  })
};




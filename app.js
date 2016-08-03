var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    //mongoskin = require('mongoskin'),
    mongoose =require('mongoose'),
    models =require('./models'),
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
    db = mongoose.connect(dbUrl, { safe: true })
    // collections = {
    //     articles: db.collection('articles'),
    //     users: db.collection('users')
    // };

var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'blog-lxj';

app.use(function(req, res, next) {
    if (!models.Article || !models.Users) return next(new Error("No models."))
    req.models = models;
    return next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("lxj-blog-cookie"));
app.use(session({ secret: "lxj-blog-session" }))
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if (req.session && req.session.admin) {
        res.locals.admin = true;
        console.log("session:ture");
    }
    if (req.cookies["login"] && req.cookies["login"] ==1) {
        res.locals.admin = true;
        console.log("cookie:ture");
    }
    next();
})
var authorize = function(req, res, next) {
    if ((req.session && req.session.admin) || (req.cookies["login"] && req.cookies["login"] ==1)) {
      console.log("admin")
        return next();
    } else {
      console.log("not admin")
        return res.send(401)
    }
}

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.article.admin);
app.get('/post', authorize, routes.article.post);
app.post('/post', authorize, routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API routes
app.all("/api", authorize)
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);



app.all('*', function(req, res) {
    res.send(404);
})

// http.createServer(app).listen(app.get('port'), function(){
// console.log('Express server listening on port ' + app.get('port'));
// });

var server = http.createServer(app);
var boot = function() {
    server.listen(app.get('port'), function() {
        console.info('Express server listening on port ' + app.get('port'));
    });
}
var shutdown = function() {
    server.close();
}
if (require.main === module) {
    boot();
} else {
    console.info('Running app as a module')
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}

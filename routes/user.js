/*
 * GET users listing.
 */

exports.list = function(req, res) {
    res.send('respond with a resource');
};


/*
 * GET login page.
 */

exports.login = function(req, res, next) {

    res.render('login');
};

/* 
 * GET logout route.
 */

exports.logout = function(req, res, next) {
    if (req.session != null) {
        req.session.destroy();
    }
    if (req.cookies["login"] == "1") {
        res.cookie("login", "0");
    }
    res.redirect('/');
};


/*
 * POST authenticate route.
 */

// exports.authenticate = function(req, res, next) {
//   res.redirect('/admin');

// };
exports.authenticate = function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.render('login', { error: "please enter your email or password" })
        console.log(req);

    };
    console.log('email: ' + req.body.email + ', password: ' + req.body.password);
    req.models.Users.findOne({
        "email": req.body.email,
        "password": req.body.password
    }, function(error, user) {
        console.log("connect")
        if (error) {
            console.log(error)
            return next(error);

        }
        if (!user) {
            console.log("user")
            return res.render('login', { error: "error email or password" })

        }
        console.log("user:" + user);
        res.cookie("login", "1", { maxAge: 60000 * 60 * 24 });
        req.session.user = user;
        req.session.admin = user.admin;
        res.redirect("/admin")
    })


};
exports.registion = function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        console.log(req);
        return res.render('login', { error: "please enter your email or password" })


    };

    req.models.Users.findOne({
        "email": req.body.email
    }, function(error, user) {
        console.log("user")
        if (error) {
            return next(error);
        }
        if (!user == null) {
            console.log(user)
            return res.render('login', { error: "email exit" })
        }
        console.log("no exit");

    })

    var use =
        {
        	email:req.body.email,
        	password:req.body.password,
        	admin:false
        };
    req.models.Users.create(use, function(error, userResponse) {
        console.log(use);
        if (error) return next(error);
        console.log("re")
        res.cookie("login", "1", { maxAge: 60000 * 60 * 24 });
        req.session.user = use.email;
        req.session.admin = false;
         console.log("redirect")
        return res.redirect("/");
    });
};

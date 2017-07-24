var express               = require("express");
var bodyParser            = require('body-parser');
var app                   = express();
var mongoose              = require("mongoose");
var methodOverride        = require("method-override");
var User                  = require("./models/user");
var passport              = require("passport");
var passportLocalStrategy = require("passport-local");
var scenicRouter          = require("./routes/scenic.js");
var commentsRouter        = require("./routes/comments.js");
var indexRouter           = require("./routes/index.js");
var flash                 = require("connect-flash");
// GoogleMap Api key: AIzaSyBr07-GYqKvIhHfG2pLXW0VCk3mXkOrtOA

// init data base.
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/scenic_spots", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
// next 3 app.use should keep sequences.
app.use(require("express-session")({
    secret: "California is a beautiful state.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req, res, next){
    res.locals.theUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// methodOverride.
app.use(methodOverride("_method"));
app.use(scenicRouter);
app.use(commentsRouter);
app.use(indexRouter);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running!!!");
})
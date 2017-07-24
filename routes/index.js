var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

 router.get("/", function(req, res){
    res.render("landing");
 });

 router.get("/register", function(req, res) {
     res.render("register");
 });
 router.post("/register", function(req, res) {
     User.register({username: req.body.username}, req.body.password, function(err, user){
         if(err) {
             req.flash("error", "The user name has been registered before! Try another one!");
             res.redirect("/register");
         } else {
             passport.authenticate("local")(req, res, function(){
                 res.redirect("/scenic");
             });
         }
     })
 });
 router.get("/login", function(req, res) {
     res.render("login");
 });
 
router.post("/login", passport.authenticate("local", {
    successRedirect: "/scenic",
    failureRedirect: "/login"
}), function(req, res){});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logout.Now you can only review places information!");
    res.redirect("/scenic");
});

module.exports = router;
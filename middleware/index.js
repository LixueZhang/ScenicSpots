var Scenic    = require("../models/scenic");
var Comment   = require("../models/comment");

var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You should login first!");
        res.redirect("/login");
    }
}
middlewareObj.checkScenicSpotOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Scenic.findById(req.params.id, function(err, foundedScenicSpot){
            if(!err && foundedScenicSpot.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "You are not allowed to do so!");
                res.redirect("back");    
            }
        });
    } else {
        req.flash("error", "You are not allowed to do so!");
        res.redirect("back");    
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.cmt_id, function(err, foundedComment){
            if(!err && foundedComment.author.id.equals(req.user._id)) {
                return next();
            } else 
                res.redirect("back");
        });
    } else
        res.redirect("back");
}

module.exports = middlewareObj;

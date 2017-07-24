var express     = require("express");
var router      = express.Router();
var Scenic        = require("../models/scenic");
var Comment     = require("../models/comment");
var middleware  = require("../middleware/index");

router.get("/scenic/:id/comments/new", middleware.isLoggedIn, function(req, res){
   Scenic.findById(req.params.id, function(err, scenicspot){
      if(!err) {
          res.render("comment/new", {scenicspot: scenicspot});
      } else
        res.redirect("/scenic");
   });
});

router.post("/scenic/:id/comments", middleware.isLoggedIn, function(req, res){
    Scenic.findById(req.params.id, function(err, scenicspot){
      if(!err) {
          Comment.create(req.body.comment, function(err, comment){
              if(err) console.log(err)
              else {
                comment.author.name = req.user.username;
                comment.author.id = req.user._id;
                comment.save();
                scenicspot.comments.push(comment);
                scenicspot.save();  
              }
          });
          res.redirect("/scenic/" + req.params.id);
      } else
        res.redirect("/scenic");
   });
});

// update comments:
router.get("/scenic/:id/comments/:cmt_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.cmt_id, function(err, retrievedComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comment/edit", {spot_id: req.params.id, comment: retrievedComment}); 
        }
    });
});

router.put("/scenic/:id/comments/:cmt_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.cmt_id, {text: req.body.text}, function(err){
        if(err) console.log(err);
        res.redirect("/scenic/" + req.params.id);
   }) 
});

router.delete("/scenic/:id/comments/:cmt_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.cmt_id, function(err){
        if(err) console.log(err);
        res.redirect("/scenic/" + req.params.id);
    })
})

module.exports = router;
var express     = require("express");
var router      = express.Router();
var Scenic        = require("../models/scenic");
var middleware  = require("../middleware/index");
var geocoder    = require('geocoder');

router.get("/scenic", function(req, res){
    Scenic.find({}, function(err, scenicspots){
        if(err) console.log(err);
        res.render("scenic/scenic", {scenicspots: scenicspots});
    });
});

router.post("/scenic", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var url = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      name: req.user.username
  }
  geocoder.geocode(req.body.location, function(err, data) {
      if(err) console.log(err);
      else{
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newScenicSpot = {name: name, url: url, desc: desc, author:author, location: location, rate: req.body.rate, lat: lat, lng: lng};
            Scenic.create(newScenicSpot, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/scenic");
                }
            });
      }
    });
});

// create page.
router.get("/scenic/new", middleware.isLoggedIn, function(req, res){
    res.render("scenic/new");
});

// show page.
router.get("/scenic/:id", function(req, res) {
    Scenic.findById(req.params.id).populate("comments").exec(function(err, scenicspot){
        if(!err) {
            res.render("scenic/show", {scenicspot : scenicspot});    
        }
    });
});

// edit page.
router.get("/scenic/:id/edit", middleware.checkScenicSpotOwnership, function(req, res) {
    Scenic.findById(req.params.id, function(err, foundedScenicSpot){
        if(err) console.log(err);
        else
            res.render("scenic/edit", {foundedScenicSpot : foundedScenicSpot});
    });
});

router.put("/scenic/:id", function(req, res){
  geocoder.geocode(req.body.scenicspot.location, function (err, data) {
      if(err) console.log(err);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.scenicspot.name, url: req.body.scenicspot.image, desc: req.body.scenicspot.desc, location: location, rate: req.body.rate, lat: lat, lng: lng};
    Scenic.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, scenicspot){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/scenic/" + scenicspot._id);
        }
    });
  });
});

//delete page
router.delete("/scenic/:id", middleware.checkScenicSpotOwnership, function(req, res){
    Scenic.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
        }
        res.redirect("/scenic");
    })
})

module.exports = router;

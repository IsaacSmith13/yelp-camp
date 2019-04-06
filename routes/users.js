const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const middleware = require("../middleware");

//user profile
router.get("/:username", function(req, res) {
    User.findOne(req.params, function(err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "User not found");
            return res.redirect("back");
        }
        Campground.find().where('author.id').equals(foundUser.id).exec(function(err, foundCampgrounds) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            res.render("users/show", { user: foundUser, campgrounds: foundCampgrounds });
        });
    });
});

module.exports = router;

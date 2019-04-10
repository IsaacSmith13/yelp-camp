const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const middleware = require("../middleware");

//show user profile
router.get("/:username", function (req, res, next) {
    User.findOne({ "id": req.params.username.toLowerCase() }, function (err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "User not found");
            return res.redirect("back");
        }
        async function send() {
            try {
                const foundCampgrounds = await Campground.find({ "author.id": foundUser._id }).populate("ratings");
                const foundReviews = await Review.find({ "author.id": foundUser._id });
                res.render("users/show", { user: foundUser, campgrounds: foundCampgrounds, reviews: foundReviews });
            }
            catch (err) {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
        }
        send();
    });
});

module.exports = router;

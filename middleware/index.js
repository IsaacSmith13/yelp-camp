var middlewareObj = {};
const Campground = require("../models/campground");
var Review = require("../models/review");

//is the user logged in?
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    req.session.redirect_to = req.path;
    res.redirect("/login");
};

//is current user the user who created this review?
middlewareObj.isReviewOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Review.findById(req.params.review_id, function (err, foundReview) {
            if (err || !foundReview) {
                req.flash("error", "Something went wrong");
                res.redirect("back");
            }
            else {
                // does user own the comment?
                if (foundReview.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

//has the user already made a review for this campground?
middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

//is logged in user the user who created this campground?
middlewareObj.isCampgroundOwner = function (req, res, next) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Sorry, that campground does not exist!");
            res.redirect("/campgrounds");
        }
        else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.campground = foundCampground;
            next();
        }
        else {
            req.flash("error", "You don't have permission to do that!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
};

module.exports = middlewareObj;

const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const middleware = require("../middleware");
const NodeGeocoder = require('node-geocoder');
const multer = require('multer');
const cloudinary = require('cloudinary');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


//multer configuration
let storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});


const imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.mimetype.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(false, new Error("Only image files are allowed!"));
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });


//cloudinary configuration
cloudinary.config({
    cloud_name: "publicparkreview",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//geocoder configuration
const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);


//INDEX - show all campgrounds
router.get("/", function(req, res) {
    let perPage = 8;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ name: regex }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds) {
            Campground.countDocuments({ name: regex }).exec(function(err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    if (allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    }
    else {
        // get all campgrounds from DB
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds) {
            Campground.countDocuments().exec(function(err, count) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});


// CREATE - add new campground to DB
router.post("/", ensureLoggedIn('/login'), upload.single('image'), async function(req, res) {
    if (req.file) {
        // upload file to cloudinary
        await cloudinary.v2.uploader.upload(req.file.path, function(err, uploadedImage) {
            if (err) {
                req.flash("error", "Only image file types are supported");
                return res.redirect("back");
            }
            else {
                let result = uploadedImage;
                // assign to campground object
                req.body.campground.image = result.secure_url;
                req.body.campground.imageId = result.public_id;
            }
        });
    }
    try {
        // add author object to campground on req.body
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        };
        // check if file uploaded
        // geocode location
        let data = await geocoder.geocode(req.body.campground.location);
        // assign lat and lng and update location with formatted address
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        // create campground from updated req.body.campground object
        let campground = await Campground.create(req.body.campground);
        // redirect to campground show page
        res.redirect(`/campgrounds/${campground.id}`);
    }
    catch (err) {
        // flash error and redirect to previous page
        req.flash('error', err.message);
        res.redirect('back');
    }
});


// NEW - form to add new campground
router.get("/new", ensureLoggedIn('/login'), function(req, res) {
    res.render("campgrounds/new");
});


// SHOW - shows more info about one campground
router.get("/:id", async function(req, res) {
    try {
        //find the campground with provided ID
        const foundCampground = await Campground.findById(req.params.id).populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } }
        });
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
    }
    catch (error) {
        req.flash("error", "Campground not found");
        return res.redirect("back");
    }
});


// EDIT - shows edit form for a campground
router.get("/:id/edit", ensureLoggedIn('/login'), middleware.isCampgroundOwner, function(req, res) {
    //render edit template with that campground
    res.render("campgrounds/edit", { campground: req.campground });
});


// PUT - update campground in database
router.put("/:id", ensureLoggedIn('/login'), middleware.isCampgroundOwner, upload.single('image'), function(req, res) {
    delete req.body.campground.rating;
    geocoder.geocode(req.body.campground.location, function(err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        else {
            req.body.campground.lat = data[0].latitude;
            req.body.campground.lng = data[0].longitude;
            req.body.campground.location = data[0].formattedAddress;
            Campground.findById(req.params.id, async function(err, campground) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else {
                    if (req.file) {
                        try {
                            await cloudinary.v2.uploader.destroy(campground.imageId);
                            let result = await cloudinary.v2.uploader.upload(req.file.path);
                            campground.imageId = result.public_id;
                            campground.image = result.secure_url;
                        }
                        catch (err) {
                            req.flash("error", "Only image file types are supported");
                            return res.redirect("back");
                        }
                    }
                    campground.name = req.body.campground.name;
                    campground.description = req.body.campground.description;
                    campground.price = req.body.campground.price;
                    campground.save();
                    req.flash("success", "Campground successfully updated!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// DESTROY - deletes a campground
router.delete('/:id', ensureLoggedIn('/login'), middleware.isCampgroundOwner, async function(req, res) {
    try {
        const foundCampground = await Campground.findById(req.params.id);
        await cloudinary.v2.uploader.destroy(foundCampground.imageId);
        await Review.remove({ "_id": { $in: foundCampground.reviews } });
        foundCampground.remove();
        req.flash('success', 'Campground successfully deleted!');
        res.redirect('/campgrounds');
    }
    catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;

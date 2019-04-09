require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const passport = require("passport");
const localStrategy = require("passport-local");
const seedDB = require("./seeds");
const methodOverride = require("method-override");
const flash = require("connect-flash");

//requiring routes
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/users");

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// seedDB(); seeds the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "annie are you okay?",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass current user through
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", indexRoutes);
app.use("/users", userRoutes);

//404 not found
app.get("/*", function (req, res) {
    req.flash("error", "Page not found");
    res.redirect("back");
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The YelpCamp Server Has Started");
});

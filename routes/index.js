const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//root route
router.get("/", function (req, res) {
    res.render("landing");
});

// ==========
// AUTH ROUTES
// ==========

//show register form
router.get("/register", function (req, res) {
    res.render("register", { page: 'register' });
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        id: req.body.username.toLowerCase(),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if (req.body.adminCode === "forgottenyogurt") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            return res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login", { page: 'login', referrer: req.headers.referrer });
});

//handles login logic
router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash("error", "You have entered an invalid username and/or password");
            return res.redirect("/login");
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            req.flash("success", "Welcome back to YelpCamp, " + user.username + "!");
            if (req.body.referrer && (req.body.referrer !== undefined && req.body.referrer.slice(-6) !== "/login")) {
                res.redirect(req.body.referrer);
            }
            else {
                res.redirect("/campgrounds");
            }
        });
    })(req, res, next);
});

//logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/campgrounds");
});

//render forgot password form
router.get("/forgot", function (req, res) {
    res.render("forgot");
});

//submit forgot password form and send email
router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'publicparkreview@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'publicparkreview@gmail.com',
                subject: 'YelpCamp Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    });
                }
                else {
                    req.flash("error", "Passwords do not match");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'publicparkreview@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'learntocodeinfo@mail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed');
                done(err);
            });
        }
      ], function (err) {
        res.redirect('/campgrounds');
    });
});

module.exports = router;

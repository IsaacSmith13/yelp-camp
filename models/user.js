const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    avatar: { type: String, default: "https://images.unsplash.com/placeholder-avatars/large.jpg" },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    description: { type: String, default: null },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

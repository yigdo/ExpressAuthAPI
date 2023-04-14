const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, requird: true },
    password: { type: String, requird: true },
    clientSecret: { type: String, requird: true },
});

module.exports = mongoose.model("User", UserSchema)
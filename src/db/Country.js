const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema({
    name: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Country", CountrySchema);
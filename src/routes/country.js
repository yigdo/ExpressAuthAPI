const express = require('express');

const router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");
const db = require('../db/db');
const Country = require("../db/Country");
const JOICountrySchema = require('../validation/JOICountrySchema');

router.get("/country/list", isAuthenticated, async (req, res) => {
    res.json(
        await Country.find({})
    );
})

router.post("/country/add", isAuthenticated, (req, res) => {
    if (typeof req.body.name === 'undefined') {
        return res.json({
            message: "Field 'name' is not provided."
        })
    }
    if (typeof JOICountrySchema.validate({ name: req.body.name }).error !== "undefined") {
        return res.json(JOICountrySchema.validate({ name: req.body.name }));
    }

    new Country({
        name: req.body.name,
        createdBy: req.user.client_id
    }).save();

    return res.json({
        message: "Record saved successfully!"
    })
})

module.exports = router;
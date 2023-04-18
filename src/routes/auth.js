const express = require('express');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const router = express.Router();

const db = require('../db/db');
const User = require("../db/User");
const JOIUserSchema = require('../validation/JOIUserSchema');
const RefreshToken = require('../db/RefreshToken');
const _db = db;

router.post("/auth/login", async (req, res) => {
    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        return res.json({
            message: "Fields Not Provided"
        })
    } else {
        if (typeof JOIUserSchema.validate({ username: req.body.username, password: req.body.password }).error !== "undefined") {
            res.json(JOIUserSchema.validate({ username: req.body.username, password: req.body.password }));
        }

        let userData = {
            username: req.body.username,
            password: req.body.password,
        }
        let user = await User.findOne({
            username: userData.username,
            password: userData.password
        });

        if (user != null) {
            userData.client_id = user._id;
            let token = jwt.sign(userData, process.env.SECRET_KEY, {expiresIn: "360000"});
            let refreshToken = await RefreshToken.findOne({ belongsTo: user._id });
            refreshToken.currentToken = token;
            await refreshToken.save();
            return res.json({
                REFRESH_TOKEN: refreshToken.refreshToken,
                ACCESS_TOKEN: token,
                EXPIRES_IN: 3600
            })
        } else {
            return res.json({
                message: "Invalid credentials",
            });
        }
    }

})

module.exports = router;
const express = require('express');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");
const db = require('../db/db');
const User = require("../db/User");

const _db = db;

router.post("/auth/login", async (req, res) => {
    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        return res.json({
            message: "Fields Not Provided"
        })
    } else {

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
            let token = jwt.sign(userData, process.env.SECRET_KEY, {expiresIn: "1h"});
            return res.json({
                token: token
            })
        } else {
            return res.json({
                message: "Invalid credentials",
            });
        }
    }

})

module.exports = router;
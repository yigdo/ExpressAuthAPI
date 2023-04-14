const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT;

const AuthRouter = require("./routes/auth");
const CountryRouter = require("./routes/country");

const User = require("./db/User");
const Country = require("./db/Country");
const db = require("./db/db");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routers
app.use(AuthRouter);
app.use(CountryRouter);

app.listen(PORT, ()=>{
    console.log("App on port: " + PORT)
    const _db = db;    
})
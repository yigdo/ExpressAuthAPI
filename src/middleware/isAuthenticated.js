const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        req.token = bearerToken;
        
        jwt.verify(req.token, process.env.SECRET_KEY, (err, data) => {
            if (err) {
                res.send({
                    message: err
                })
            } else {
                req.user = data;
                next();
            }
        })
    }else{
        res.sendStatus(403);
    }
};
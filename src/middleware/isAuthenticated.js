const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const RefreshToken = require("../db/RefreshToken")
const User = require("../db/User")

const isTokenExpired = token => Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000

module.exports = (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        req.token = bearerToken;
        
        jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
            if (err) {
               if(typeof req.body.refresh_token !== "undefined"){
                   if(isTokenExpired(req.token) == true){
                        let userRefreshToken = await RefreshToken.findOne({
                            refreshToken: req.body.refresh_token,
                            currentToken: req.token
                        })
                        if(userRefreshToken != null){
                            let user = await User.findOne({_id: userRefreshToken.belongsTo})
                            if(user == null) res.json({ message: "User not found" });
                            let userData = {
                                username: user.username,
                                password: user.password
                            }
                            let newToken = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: "360000" });
                            userRefreshToken.currentToken = newToken;
                            userRefreshToken.save();
                            jwt.verify(newToken, process.env.SECRET_KEY, (err, data) => {
                                if(err){
                                    return res.json({
                                        message: "Unexpected error occured!"
                                    })
                                }else{
                                    req.user = data;
                                    next();
                                }
                            })
                        }else{
                            return res.json({
                                message: "Invalid refresh token!"
                            })
                        }
                   }
               }else{
                   return res.send({
                       message: err
                   })
               }
            } else {
                req.user = data;
                next();
            }
        })
    }else{
        return res.sendStatus(403);
    }
};
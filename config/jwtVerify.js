const jwt = require('jsowebtoken');
const globalConfig = require('./config');

module.exports = function(req,res,next){
    var bearerHeader = req.headers['authorization'];
    var token;
    var userid;
    if (bearerHeader){
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
        jwt.verify(token, globalConfig.secretKey, function (err, decoded){
            if (err){
                userid = null;
            } else {
                userid = decoded.id;
            }
        });
    }
    return userid;
}
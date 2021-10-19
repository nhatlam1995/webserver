const jwt = require('jsonwebtoken')

module.exports = function decodeToken(req) {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET);
    return decoded
}
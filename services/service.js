const jwt = require('jsonwebtoken')

module.exports = function decodeToken(req) {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'lkj1vxcdsf9-wefgwe8eto');
    return decoded
}
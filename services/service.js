const jwt = require('jsonwebtoken')

const decoded = (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'secret-key');
    console.log(decoded);
}

module.exports = decoded
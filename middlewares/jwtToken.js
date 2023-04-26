let appConfig = require("../appConfig.json");
let jwt = require("jsonwebtoken");
let jwtTokens = {
    authenticateToken: function (req, res, next) {
        const token = req.session.user;
        if (token === undefined) return res.status(401).redirect("/signin");
        jwt.verify(token, appConfig.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(401).redirect("/signin");
            } else {
                return next();
            }
        });
    },
};
module.exports = jwtTokens;

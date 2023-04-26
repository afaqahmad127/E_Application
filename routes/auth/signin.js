let express = require('express');
const AuthMW = require("../../middlewares/userMiddleware");
const AuthBal = require("../../bal/authBal");
const JWT = require("jsonwebtoken");
const appConfig = require("../../appConfig.json");
let AuthJWT = require('../../middlewares/jwtToken');
let router = express.Router();


router.get('/',function (req, res, next) {
    const token = req.session.user;
    if (token === undefined || token === null) {
        return next();
    } else {
        return res.status(401).redirect("/dashboard");
    }
},function (req, res) {
    res.render('auth/signin');
});
router.post('/',AuthMW.checkCredentials,function (req, res) {
    AuthBal.checkCredentials(req.body, function (data) {
        const token = JWT.sign(
            {user: data.data},
            appConfig.JWT_KEY,
        );
        req.session.isAuthenticated = true;
        req.session.user = token;
        res.status(200).send(data);
    });
});

router.get('/logout', function (req, res) {
    req.session.isAuthenticated = false;
    req.session.user = null;
    res.status(200).redirect('/');
});

module.exports = router;
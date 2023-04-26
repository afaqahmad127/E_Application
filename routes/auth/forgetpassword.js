let express = require('express');
let router = express.Router();
let AuthMW = require('../../middlewares/userMiddleware');
let AuthBal = require('../../bal/authBal');
const JWT = require("jsonwebtoken");
const appConfig = require("../../appConfig.json");

// Create Organization Route
router.get('/', function (req, res, next) {
    const token = req.session.user;
    if (token === undefined || token === null) {
        return next();
    } else {
        return res.status(401).redirect("/dashboard");
    }
},function (req, res) {
    res.render('auth/forgetpassword/forgetpassword');
});
router.post('/', AuthMW.checkEmailExistForget, AuthMW.sendEmail,function (req, res) {
        AuthBal.updateOtp(req.body, function (data) {
            if(data.message !== "error"){
                const token = JWT.sign(
                    {user_email: data.data.email},
                    appConfig.JWT_KEY,
                );
                res.status(200).send(token);
            }else{
                res.status(500).send(data);
            }
        })
});

router.get('/verification', function (req, res) {
    const decoded = JWT.verify(req.query.token, appConfig.JWT_KEY);
    res.render('auth/forgetpassword/verification',{token:decoded.user_email});
});

router.get('/resetpassword', function (req, res) {
    const decoded = JWT.verify(req.query.token, appConfig.JWT_KEY);
    res.render('auth/forgetpassword/resetpassword',{token:decoded.user_email});
});

router.post('/resetpassword', AuthMW.encryptPassword,function (req, res) {
    AuthBal.changePassword(req.body, function (data) {
        if(data.message !== "error"){
            res.status(200).send(data);
        }else{
            res.status(500).send(data);
        }
    })
});


module.exports = router;
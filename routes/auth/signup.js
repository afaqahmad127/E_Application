let express = require('express');
let router = express.Router();
let AuthBal = require('../../bal/authBal');
let AuthMW = require('../../middlewares/userMiddleware')
let appConfig = require('../../appConfig.json');
let JWT = require('jsonwebtoken');

// Create Organization Route
router.get('/', function (req, res, next) {
    const token = req.session.user;
    if (token === undefined || token === null) {
        return next();
    } else {
        return res.status(401).redirect("/dashboard");
    }
},function (req, res) {
    res.render('auth/signup');
});

router.post('/', AuthMW.checkUserNameExist,AuthMW.checkRegistrationNoExist, AuthMW.checkCnicExist, AuthMW.checkEmailExist,AuthMW.encryptPassword,AuthMW.sendEmail,function (req, res) {
   AuthBal.userSignUp(req.body, function (data) {
       if(data.message !== 'error'){
           const token = JWT.sign(
               {user_email: data.data.email},
               appConfig.JWT_KEY,
           );
           res.status(200).send(token);
       }else{
           res.status(500).render('auth/signup');
       }
   })
});
router.get('/verifyaccount', function (req, res) {
    const decoded = JWT.verify(req.query.token, appConfig.JWT_KEY);
    res.render('auth/verification',{token:decoded.user_email});
});

router.post('/verifyaccount', AuthMW.checkOtp,function (req, res) {
    AuthBal.verifyAccount(req.body.email,function (data) {
        if(data.message !== "error"){
            const token = JWT.sign(
                {user_email: data.data.email},
                appConfig.JWT_KEY,
            );
            res.status(200).send(token);
        }else{
            res.status(500).json({message:'server error'});
        }
    })

});

router.put('/resendemail', AuthMW.sendEmail,function (req, res) {
    AuthBal.updateOtp(req.body, function (data) {
        if(data.message !== "error"){
            res.status(200).send(data);
        }else{
            res.status(500).send(data);
        }
    });
});


module.exports = router;
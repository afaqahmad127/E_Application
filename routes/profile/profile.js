let express = require('express');
const JWT = require("jsonwebtoken");
const appConfig = require("../../appConfig.json");
const Directory = require("../../middlewares/directory");
const AuthBal = require("../../bal/authBal");
const Multer = require("../../middlewares/multer");
let router = express.Router();

router.get('/', function (req, res) {
    let token = req.session.user;
    JWT.verify(token, appConfig.JWT_KEY,(err, user) => {
        if (err) {
            console.log(JSON.stringify(err))
        } else {
            res.render('profile/profile', {user: user.user});
        }
    });
});

router.post('/',Directory.checkDirectory,Multer.single('file') ,function (req, res) {
    if(req.file !== undefined){
        req.body.image = req.protocol + '://' + req.get('host') + "/" + 'public/upload/' + req.file.filename;
    }else{
        req.body.image = null;
    }
    AuthBal.updateUserSignature(req.body,function (data) {
        if(data.message !=='error'){
            const token = JWT.sign(
                {user: data.data},
                appConfig.JWT_KEY,
            );
            req.session.user = null;
            req.session.user = token;
            res.status(200).redirect('/profile')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});
router.post('/uploadsignature',Directory.checkDirectory,Multer.single('file') ,function (req, res) {
    console.log(req.body);
    if(req.file !== undefined){
        req.body.image = req.protocol + '://' + req.get('host') + "/" + 'public/upload/' + req.file.filename;
    }else{
        req.body.image = null;
    }
    AuthBal.updateUserSignature(req.body,function (data) {
        if(data.message !=='error'){
            const token = JWT.sign(
                {user: data.data},
                appConfig.JWT_KEY,
            );
            req.session.user = null;
            req.session.user = token;
            res.status(200).redirect('/profile')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});



module.exports = router;
let AUthBal = require('../bal/authBal');
let bcrypt = require('bcryptjs');
let NodeMailer = require("nodemailer");
let appConfig = require('../appConfig.json');

let getOTP = function () {
    let rand="";
    for (let i = 0; i < 5; i++) {
        rand +=Math.floor(Math.random() * 10);
    }
    console.log(rand);
    return rand;
}
let AuthMiddleware = {
    checkUserNameExist:function (req, res, next) {
        AUthBal.checkUserNameExist(req.body.userName, function (data) {
            if (data.exist){
                res.status(401).json({message:'username exist'});
            }else{
                return next();
            }
        })
    },
    checkRegistrationNoExist:function (req, res, next) {
        AUthBal.checkRegistrationNoExist(req.body.registrationNo, function (data) {
            if (data.exist){
                res.status(401).json({message:'reg exist'});
            }else{
                return next();
            }
        })
    },
    checkCnicExist:function (req, res, next) {
        AUthBal.checkCnicExist(req.body.cnic, function (data) {
            if (data.exist){
                res.status(401).json({message:'cnic exist'});
            }else{
                return next();
            }
        });
    },
    checkEmailExist:function (req, res, next) {

       if(!(req.body.email.toLowerCase().includes('@kfueit.edu.pk'))){
           res.status(401).json({message:'not student'});
       }else{
           AUthBal.checkEmailExist(req.body.email.toLowerCase(), function (data) {
               if (data.exist){
                   res.status(401).json({message:'email exist'});
               }else{
                   return next();
               }
           })
       }
    },
    checkOtp:function (req, res, next) {
        AUthBal.checkOtp(req.body.email, function (data) {
            console.log(data.data.otp);
            if (data.data.otp == req.body.otp){
                return next();
            }else{
                return res.status(401).json({message:'otp wrong'});
            }
        })
    },
    encryptPassword: function (req, res, next) {
        const password = req.body.password;
        const round = 10
        bcrypt.genSalt(round, function (err, salt) {
            if (err) {
                return res.status(500).json({message:'Password encryption Error'});
            } else {
                bcrypt.hash(password, salt, function (hashError, encryptedPassword) {
                    if (hashError) {
                        return res.status(500).json({message:'Password encryption Error'});
                    } else {
                        req.body.encryptedPassword = encryptedPassword;
                        return next();
                    }
                });
            }
        });
    },
    sendEmail: function (req, res, next) {
        console.log(req.body.email);
        let transporter = NodeMailer.createTransport({
            service: 'gmail',
            // host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: appConfig.OWNER_EMAIL,
                pass: appConfig.OWNER_EMAIL_PASSWORD,
            }
        });
        let body = appConfig.VERIFY_EMAIL_BODY;
        let otp = getOTP();
        body +=otp;
        body +='\n\nThank You!'
        let mailOptions = {
            from: appConfig.OWNER_EMAIL,
            to: req.body.email,
            subject: appConfig.VERIFY_EMAIL_SUBJECT,
            text: body
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(JSON.stringify(error));
                return res.status(401).json({message:'email sending error'})
            } else {
                req.body.otp = otp;
                return next();
            }
        });
    },
    checkCredentials:function (req, res, next) {
        AUthBal.checkCredentials(req.body,function (data) {
            if (data.message === "error") {
                res.status(500).send(data);
            } else if (!(data.email)) {
                res.status(401).json({message:data.message});
            } else if (!(data.password)) {
                res.status(401).json({message:data.message});
            } else if ((data.email && data.password)) {
                return next();
            }
        })
    },
    checkEmailExistForget:function (req, res, next) {
        AUthBal.checkEmailExist(req.body.email.toLowerCase(), function (data) {
            if (data.exist){
                return next();
            }else{
                res.status(401).json({message:'email not exist'});
            }
        })
    },
}
module.exports = AuthMiddleware;
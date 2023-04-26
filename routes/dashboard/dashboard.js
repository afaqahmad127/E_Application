let express = require('express');
const JWT = require("jsonwebtoken");
const appConfig = require("../../appConfig.json");
let AuthJWT = require('../../middlewares/jwtToken');
let AuthBal = require('../../bal/authBal');
let AppBal = require('../../bal/appBal');
let moment = require('moment');
let pdf = require("html-pdf");
let ejs = require("ejs");
let router = express.Router();

router.get('/',function (req, res) {
    let token = req.session.user;
    JWT.verify(token, appConfig.JWT_KEY,(err, user) => {
        if (err) {
            console.log(JSON.stringify(err))
        } else {
            AppBal.getAllSentApplication(user.user.email,function (sentApp) {
                console.log('SENT APP',JSON.stringify(sentApp.data));
                AppBal.getAllReceivedApplication(user.user.userName,function (receivedApp) {
                    console.log(user.user);
                    if(receivedApp.message !== 'error'){
                        res.render('dashboard/dashboard', {user: user.user, sentApp:sentApp.data,moment:moment, receivedApp:receivedApp.data});
                    }else{
                        res.send(sentApp);
                    }
                })

            })
        }
    });
});

router.get('/writeapplication',function (req, res) {
    let token = req.session.user;
    JWT.verify(token, appConfig.JWT_KEY,(err, user) => {
        if (err) {
            console.log(JSON.stringify(err))
        } else {
            AuthBal.getAllUsers(user.user.email,function (data) {
                if(data.message !== 'error'){
                    res.render('application/application', {user: user.user, users:data.data});
                }else{
                    res.status(500).redirect('/dashboard');
                }
            })

        }
    });
});

router.post('/writeapplication', function (req, res) {
    AppBal.addApplication(req.body, function (data) {
        if(data.message !== 'error'){
            res.status(200).redirect('/dashboard')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});

router.post('/sendmessage', function (req, res) {
    AppBal.addMessageToApplication(req.body, function (data) {
        if(data.message !== 'error'){
            res.status(200).redirect('/dashboard')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});
router.post('/acceptapplication', function (req, res) {
    AppBal.acceptApplication(req.body, function (data) {
        if(data.message !== 'error'){
            res.status(200).redirect('/dashboard')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});
router.post('/rejectapplication', function (req, res) {
    AppBal.rejectApplication(req.body, function (data) {
        if(data.message !== 'error'){
            res.status(200).redirect('/dashboard')
        }else{
            res.status(500).redirect('/dashboard');
        }
    })
});
router.post('/downloadpdf', function (req, res) {
    console.log('CALEDDDDDDDDDDDDDDDD');
    AppBal.getApplicationDetailById(req.body.appId, function (data) {
        if(data.message !== 'error'){
            // res.send(data.data);
            console.log('DONE');
                ejs.renderFile('./views/template.ejs', {appData: data.data}, (err, data) => {
                    if (err) {
                        console.log('ERROR in Template-->',JSON.stringify(err));
                        res.send(err);
                    } else {
                        console.log(JSON.stringify( data.data));
                        var options = {
                            "height": "11.25in",
                            "width": "8.5in",
                            "header": {
                                "height": "20mm"
                            },
                            "footer": {
                                "height": "20mm",
                            },
                        };
                        pdf.create(data, options).toFile(`./public/${req.body.appId}.pdf`, function (err, data) {
                            if (err) {
                                console.log('ERROR-->',JSON.stringify(err));
                                res.send(err);
                            } else {
                                // console.log(data);
                                var fileLocation = data['filename'];
                                var array  = fileLocation.split('\\');
                                var file = req.protocol + '://' + req.get('host') + "/" + 'public/' + array[array.length-1];
                               console.log(file);
                                res.status(200).json({file:file});
                                // res.send("File created successfully");
                            }
                        });
                    }
                });
        }else{
            res.status(500).json({error:'server-error'});
        }
    })
});

module.exports = router;
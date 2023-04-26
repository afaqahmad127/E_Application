var express = require('express');
const JWT = require("jsonwebtoken");
const appConfig = require("../appConfig.json");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let token = req.session.user;
  if(token){
    JWT.verify(token, appConfig.JWT_KEY,(err, user) => {
      if (err) {
        console.log(JSON.stringify(err))
      } else {
        res.render('index', { title: 'Express',user: user.user });
      }
    });
  }else{
    res.render('index', { title: 'Express',user: null });
  }
});

module.exports = router;

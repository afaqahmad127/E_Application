let express = require('express');
let router = express.Router();

// Create Organization Route
router.get('/', function (req, res) {
    let authentication = req.session.isAuthenticated;
    res.render('faqs/faqs',{isAuthenticated:authentication});
});

module.exports = router;
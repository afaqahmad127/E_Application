let express = require('express');
let router = express.Router();

// Create Organization Route
router.get('/', function (req, res) {
    res.render('about/about');
});

module.exports = router;
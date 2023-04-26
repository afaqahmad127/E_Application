let fs = require('fs');

let Directory = {
    checkDirectory: function (req, res, next) {
        let dir = './public/upload/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
            return next();
        } else {
            return next();
        }
    },
}
module.exports = Directory;
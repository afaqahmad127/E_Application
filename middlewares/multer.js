const multer = require("multer");
const path = require("path");
// let appConfig = require("../appConfig.json");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/upload/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept a file
    console.log(`File ${file.mimetype}`);
    console.log(path.join(__dirname, "../public/upload"));
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    // fileFilter: fileFilter
});

module.exports = upload;
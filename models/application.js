const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const schema = Schema({
    senderEmail: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required:true
    },
    recipients: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Applications", schema);
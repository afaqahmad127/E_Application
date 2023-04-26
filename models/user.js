const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const schema = Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    registrationNo: {
        type: String,
        default: null
    },
    cnic: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: null,
    },
    signature: {
        type: String,
        required: false,
        default:null,
    },
    status: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Users", schema);
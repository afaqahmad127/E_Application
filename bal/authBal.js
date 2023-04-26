let AuthDal = require('../dal/authDal');

let AuthBal = {
    userSignUp: function (body, callback) {
        AuthDal.userSignUp(body, function(data){
            callback(data);
        });
    },
    checkUserNameExist: function (username, callback) {
        AuthDal.checkUserNameExist(username, function(data){
            callback(data);
        });
    },
    checkRegistrationNoExist: function (regNo, callback) {
        AuthDal.checkRegistrationNoExist(regNo, function(data){
            callback(data);
        });
    },
    checkCnicExist: function (cnic, callback) {
        AuthDal.checkCnicExist(cnic, function(data){
            callback(data);
        });
    },
    checkEmailExist: function (email, callback) {
        AuthDal.checkEmailExist(email, function(data){
            callback(data);
        });
    },
    checkOtp: function (email, callback) {
        AuthDal.checkOtp(email, function(data){
            callback(data);
        });
    },
    verifyAccount:function (email, callback) {
        AuthDal.verifyAccount(email, function(data){
            callback(data);
        });
    },
    updateOtp:function (body, callback) {
        AuthDal.updateOtp(body, function(data){
            callback(data);
        });
    },
    checkCredentials:function (body, callback) {
        AuthDal.checkCredentials(body, function(data){
            callback(data);
        });
    },
    getUserByEmail:function (email, callback) {
        AuthDal.getUserByEmail(email, function(data){
            callback(data);
        });
    },
    changePassword:function (email, callback) {
        AuthDal.changePassword(email, function(data){
            callback(data);
        });
    },
    updateUserData:function (body, callback) {
        AuthDal.updateUserData(body, function(data){
            callback(data);
        });
    },
    updateUserSignature:function (body, callback) {
        AuthDal.updateUserSignature(body, function(data){
            callback(data);
        });
    },
    getAllUsers:function (currentUserEmail, callback) {
        AuthDal.getAllUsers(currentUserEmail, function(data){
            callback(data);
        });
    },

}
module.exports = AuthBal;
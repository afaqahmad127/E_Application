let UserModal = require('../models/user');
let bcrypt = require('bcryptjs');

let AuthDal = {
    userSignUp: function(body, callback){
        let finalData;
        new UserModal({
            fullName:body.fullName,
            userName:body.userName,
            registrationNo: body.registrationNo,
            cnic:body.cnic,
            email: body.email.toLowerCase(),
            phoneNo: body.phoneNo,
            department: body.department,
            password: body.encryptedPassword,
            otp: parseInt(body.otp),
            status:body.status,
        }).save().then((result) => {
            finalData = {message:'success', data:result}
            callback(finalData);
        }).catch((err) => {
            finalData = {message:'error', data:err}
            callback(finalData);
        });
    },
    checkUserNameExist:function (userName, callback) {
        let finalData;
        UserModal.findOne({userName:userName},function (err, user) {
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                finalData = {
                    message: "username exist",
                    exist: true,
                };
                callback(finalData);
            } else {
                finalData = {
                    message: "username does not exist",
                    exist: false,
                    data: user,
                };
                callback(finalData);
            }
        });
    },
    checkRegistrationNoExist:function (regNo, callback) {
        let finalData;
        UserModal.findOne({registrationNo:regNo},function (err, user) {
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                finalData = {
                    message: "reg exist",
                    exist: true,
                };
                callback(finalData);
            } else {
                finalData = {
                    message: "reg does not exist",
                    exist: false,
                    data: user,
                };
                callback(finalData);
            }
        });
    },
    checkCnicExist:function (cnic, callback) {
        let finalData;
        UserModal.findOne({cnic:cnic},function (err, user) {
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                finalData = {
                    message: "cnic exist",
                    exist: true,
                };
                callback(finalData);
            } else {
                finalData = {
                    message: "cnic does not exist",
                    exist: false,
                    data: user,
                };
                callback(finalData);
            }
        });
    },
    checkEmailExist:function (email, callback) {
        let finalData;
        UserModal.findOne({email:email},function (err, user) {
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                finalData = {
                    message: "email exist",
                    exist: true,
                };
                callback(finalData);
            } else {
                finalData = {
                    message: "email does not exist",
                    exist: false,
                    data: user,
                };
                callback(finalData);
            }
        });
    },
    checkOtp:function (email,callback) {
        let finalData;
        UserModal.findOne({email:email},function (err, user) {
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                finalData = {
                    message: "email exist",
                    data: user,
                };
                callback(finalData);
            } else {
                finalData = {
                    message: "email does not exist",
                    data: user,
                };
                callback(finalData);
            }
        });
    },
    verifyAccount:function (email, callback) {
        UserModal.findOneAndUpdate(
            {email: email},
            {
                $set: {
                    isVerified: true,
                },
            },
            {returnOriginal: false},
            function (err, data) {
                if (err) {
                    let finalData = {message: "error", data: err.message};
                    callback(finalData);
                } else {
                    let finalData = {message: "success", data: data};
                    callback(finalData);
                }
            }
        );
    },
    updateUserData:function (body, callback) {
       if(body.image !== null){
           UserModal.findOneAndUpdate(
               {email: body.email},
               {
                   $set: {
                       status:body.status,
                       department:body.department,
                       phoneNo:body.phoneNo,
                       image: body.image,
                   },
               },
               {returnOriginal: false},
               function (err, data) {
                   if (err) {
                       let finalData = {message: "error", data: err.message};
                       callback(finalData);
                   } else {
                       let finalData = {message: "success", data: data};
                       callback(finalData);
                   }
               }
           );
       }else{
           UserModal.findOneAndUpdate(
               {email: body.email},
               {
                   $set: {
                       status:body.status,
                       department:body.department,
                       phoneNo:body.phoneNo,
                   },
               },
               {returnOriginal: false},
               function (err, data) {
                   if (err) {
                       let finalData = {message: "error", data: err.message};
                       callback(finalData);
                   } else {
                       let finalData = {message: "success", data: data};
                       callback(finalData);
                   }
               }
           );
       }
    },
    updateUserSignature:function (body, callback) {
        console.log(body);
       if(body.image !== null){
           UserModal.findOneAndUpdate(
               {email: body.email},
               {
                   $set: {
                       signature:body.image,
                   },
               },
               {returnOriginal: false},
               function (err, data) {
                   if (err) {
                       let finalData = {message: "error", data: err.message};
                       callback(finalData);
                   } else {
                       let finalData = {message: "success", data: data};
                       callback(finalData);
                   }
               }
           );
       }
    },
    changePassword:function (body, callback) {
        UserModal.findOneAndUpdate(
            {email: body.email},
            {
                $set: {
                    password: body.encryptedPassword,
                },
            },
            {returnOriginal: false},
            function (err, data) {
                if (err) {
                    let finalData = {message: "error", data: err.message};
                    callback(finalData);
                } else {
                    let finalData = {message: "success", data: data};
                    callback(finalData);
                }
            }
        );
    },
    updateOtp:function (body, callback) {
        let finalData;
        console.log(body.email, body.otp);
        UserModal.findOneAndUpdate(
            {email: body.email},
            {
                $set: {
                    otp: body.otp,
                },
            },
            {returnOriginal: false},
            function (err, data) {
                if (err) {
                    finalData = {message: "error", data: err.message};
                    callback(finalData);
                } else {
                    finalData = {message: "success", data: data};
                    callback(finalData);
                }
            }
        );
    },
    checkCredentials:function (body, callback) {
        UserModal.findOne({
            $or:[
                {
                    email:{
                        $eq:body.username.toLowerCase()
                    }
                },
                {
                    registrationNo:{
                        $eq:body.username
                    }
                }
            ]
        }, function (err, user) {
            let finalData;
            if (err) {
                finalData = {message: "error", data: err.message};
                callback(finalData);
            }
            if (user) {
                const passwordEnteredByUser = body.password;
                const hash = user.password;
                bcrypt.compare(passwordEnteredByUser, hash, function (error, isMatch) {
                    if (error) {
                        finalData = {
                            message: "error",
                        };
                        callback(finalData);
                    } else if (!isMatch) {
                        finalData = {
                            message: "wrong password",
                            password: false,
                            email: true,
                        };
                        callback(finalData);
                    } else {
                        finalData = {
                            message: "login success",
                            data: user,
                            email: true,
                            password: true,
                        };
                        callback(finalData);
                    }
                });
            } else {
                finalData = {
                    message: "wrong email",
                    email: false,
                };
                callback(finalData);
            }
        });
    },
    getUserByEmail:function (email, callback) {
        let finalData;
        UserModal.findOne({email:email}).then((result)=>{
            finalData = {message:'success', data:result}
            callback(finalData);
        }).catch((e)=>{
            finalData = {message:'error', data:e.message}
            callback(finalData);
        })
    },
    getAllUsers:function (currentUserEmail,callback) {
        let finalData;
        UserModal.find({
            email:{$ne:currentUserEmail},
            status:{$ne:'Student'}
        }).then((result)=>{
            finalData = {message:'success', data:result}
            callback(finalData);
        }).catch((e)=>{
            finalData = {message:'error', data:e.message}
            callback(finalData);
        })
    },
}

module.exports = AuthDal;
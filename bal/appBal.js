let AppDal = require('../dal/appDal');

let AppBal = {
    addApplication: function(body, callback){
       AppDal.addApplication(body, function (data) {
           callback(data);
       })
    },
    getAllSentApplication: function(email, callback){
        AppDal.getAllSentApplication(email, function (data) {
            callback(data);
        })
    },
    getAllReceivedApplication: function(userName, callback){
        AppDal.getAllReceivedApplication(userName, function (data) {
            callback(data);
        });
    },
    addMessageToApplication:function (body, callback) {
        AppDal.getApplicationById(body.appId, function (application) {
            body.recipients = application.data.recipients.map((r) => {
                if(r.username == body.senderUserName){
                    r.message = body.message
                }
                return r;
            });
         AppDal.updateApplication(body, function (data) {
             console.log(JSON.stringify(data));
             callback(data);
         });
        });
    },
    acceptApplication:function (body, callback) {
        console.log(`Accepted APp-->${JSON.stringify(body)}`);
        AppDal.getApplicationById(body.appId, function (application) {
            body.recipients = application.data.recipients.map((r) => {
                if(r.username == body.userName){
                    r.status = 'A'
                }
                return r;
            });
         AppDal.updateApplication(body, function (data) {
             console.log(JSON.stringify(data));
             callback(data);
         });
        });
    },
    rejectApplication:function (body, callback) {
        console.log(`Accepted APp-->${JSON.stringify(body)}`);
        AppDal.getApplicationById(body.appId, function (application) {
            body.recipients = application.data.recipients.map((r) => {
                if(r.username == body.userName){
                    r.status = 'R'
                }
                return r;
            });
         AppDal.updateApplication(body, function (data) {
             console.log(JSON.stringify(data));
             callback(data);
         });
        });
    },
    getApplicationDetailById:function (appId, callback) {
        AppDal.getApplicationDetailById(appId, function (data) {
            callback(data);
        })
    }
}

module.exports = AppBal;
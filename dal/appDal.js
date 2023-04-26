let AppModel = require('../models/application');
const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

let AppDal = {
	addApplication: function (body, callback) {
		let finalData;
		new AppModel({
			senderEmail: body.senderEmail,
			subject: body.subject,
			body: body.body,
			recipients: body.recipients,
		})
			.save()
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
	getAllSentApplication: function (email, callback) {
		let finalData;
		AppModel.find({ senderEmail: email })
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
	getApplicationById: function (appId, callback) {
		let finalData;
		AppModel.findById(new ObjectId(appId))
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
	getAllReceivedApplication: function (userName, callback) {
		let finalData;
		AppModel.aggregate([
			{
				$unwind: '$recipients',
			},
			{
				$match: {
					'recipients.username': userName,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'senderEmail',
					foreignField: 'email',
					as: 'sender',
				},
			},
			{
				$unwind: '$sender',
			},
		])
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
	updateApplication: function (body, callback) {
		let finalData;
		AppModel.findByIdAndUpdate(new ObjectId(body.appId), {
			$set: {
				recipients: body.recipients,
			},
		})
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
	getApplicationDetailById: function (appId, callback) {
		// console.log(appId);
		let finalData;
		AppModel.aggregate([
			{
				$match: {
					_id: new ObjectId(appId),
				},
			},
			{
				$unwind: {
					path: '$recipients',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'recipients.username',
					foreignField: 'userName',
					as: 'recipientsDetail',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'senderEmail',
					foreignField: 'email',
					as: 'senderDetail',
				},
			},
			{
				$unwind: {
					path: '$recipientsDetail',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: '$_id',
					Subject: {
						$first: '$subject',
					},
					body: {
						$first: '$body',
					},
					senderDetail: {
						$first: '$senderDetail',
					},
					recipientsDetail: {
						$push: '$recipientsDetail',
					},
					status: {
						$push: '$recipients.status',
					},
				},
			},
			{
				$unwind: {
					path: '$senderDetail',
					preserveNullAndEmptyArrays: true,
				},
			},
		])
			.then((result) => {
				finalData = { message: 'success', data: result };
				callback(finalData);
			})
			.catch((err) => {
				finalData = { message: 'error', data: err };
				callback(finalData);
			});
	},
};

module.exports = AppDal;

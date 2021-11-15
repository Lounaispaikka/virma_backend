const db = require('../../db');
const Model = require('../../db');

const imageService = require('./imageService.js');
const axios = require('axios');

function createLog(operation, model, name = undefined, user = undefined, message = undefined) {

	const params = {
		operation: operation,
		target_name: name ? name : undefined,
		target_table: model.getTableName(),
		timestamp: new Date,
		msg: message + '',
		executor: user ? user : undefined
	}
	console.log("[CRUD] ", operation, name, model.getTableName(), message);
	Model.logs.create(params);
}
function streamToString (stream) {
	const chunks = [];
	return new Promise((resolve, reject) => {
	  stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
	  stream.on('error', (err) => reject(err));
	  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	})
  }
  
function paramsModifyHook(res, model, params, user) {

	return new Promise((resolve, reject) => {

		console.log("params", params.www_picture, params.picture);

		// modify www_picture to always be from our systems
		if (!params.www_picture) {
			return resolve(false);
		}

		var absolute = false;
		try {
			absolute = new URL(params.www_picture);
		} catch (e) {
		}

		
		const ourURL = absolute && imageService.isOurURL(absolute);
		
		// some absolute path that we don't own, let's modify it
		if (absolute && !ourURL) {
			console.log("Converting absolute url:", absolute.href);
			console.log(params);
			console.log(model);
			
			// get the file
			axios({
				url: absolute.href,
				method: 'GET',       
				maxContentLength: 30000000,
				maxBodyLength: 300000000,
				responseType: 'stream', 
			}).then((response) => {
				params.www_picture = "https://via.placeholder.com/300x200.jpg?text=override";

				const key = params.gid+"-"+Math.floor(+new Date())+".jpg";
				
  				//streamToString(response.data).then((image)=>{
				const image = response.data;
				console.log("image type",typeof image);
				imageService.uploadS3(key, image).then((data)=> {
					
					console.log("overwrote",params.www_picture);
					params.www_picture = data.Location;

					return resolve(true);
				}).catch((error)=>{
					reject(error);
					res.json({ 'message': error });
				});
				
			});


		} else if (ourURL) {
			return resolve(params.www_picture);
		} else {
			console.log("discarding", params.www_picture);
			params.www_picture = "https://via.placeholder.com/300x200.jpg?text=invalid%20URL";
			return resolve(params.www_picture);
		}
	});

}

exports.createFeature = function (res, model, params, user) {
	paramsModifyHook(res, model, params, user).then(() => {

		model.create(params).then(response => {
			createLog('CREATE', model, params.name_fi, user);
			res.json({ 'message': response });
		}).catch(error => {
			createLog('CREATE_ERROR', model, undefined, undefined, error);
			res.status(500).json({ 'message': error });
		});

	});
}

exports.updateFeature = function (res, model, id, params, user) {
	paramsModifyHook(res, model, params, user).then(() => {

		model.update(params, { where: { gid: id } }).then(response => {
			paramsModifyHook(res, model, params, user);
			createLog('UPDATE', model, params.name_fi, user);
			res.json({ 'message': response });
		}).catch(error => {
			createLog('UPDATE_ERROR', model, undefined, undefined, error);
			res.status(500).json({ 'message': error });
		});
	});
}

exports.deleteFeature = function (res, model, id, name, user) {
	model.destroy({ where: { gid: id } }).then(response => {
		createLog('DELETE', model, name, user);
		res.json({ 'message': response });
	}).catch(error => {
		createLog('DELETE_ERROR', model, undefined, undefined, error);
		res.status(500).json({ 'message': error });
	});
}

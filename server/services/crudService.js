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
	return Model.logs.create(params);
}

function flipGeom(params) {
	//if (params["geom"]) {
		
	//}
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
			console.log("Params:",params);
			console.log("Model:",model);
			
			// get the file
			axios({
				url: absolute.href,
				method: 'GET',       
				maxContentLength: 30000000,
				maxBodyLength: 30000000,
				responseType: 'stream', 
			}).then((response) => {
				params.www_picture = "https://virma.lounaistieto.fi/images/pic_overriding.jpg";

				const key = params.gid+"-"+Math.floor(+new Date())+".jpg";
				
  				//streamToString(response.data).then((image)=>{
				const image = response.data;
				console.log("image type",typeof image);
				imageService.uploadS3(key, image, user.username).then((data)=> {
					
					console.log("overwrote",params.www_picture);
					params.www_picture = data.Location;

					return resolve(true);
				}).catch((error)=>{
					console.error("axios fail?",error);
					reject(error);
					res.json({ 'message': error });
				});
				
			});


		} else if (ourURL) {
			return resolve(params.www_picture);
		} else {
			console.log("discarding", params.www_picture);
			params.www_picture = "https://virma.lounaistieto.fi/images/invalidurl.png";
			return resolve(params.www_picture);
		}
	});

}

exports.createFeature = function (res, model, params, user) {
	flipGeom(params);
	paramsModifyHook(res, model, params, user).then(() => {

		model.create(params).then(response => {
			createLog('CREATE', model, params.name_fi, user);
			res.json({ 'message': response });
		}).catch(e => {
			const error = e+"";
			createLog('CREATE_ERROR', model, undefined, undefined, error);
			res.status(500).json({ 'message': error });
		});

	});
}

exports.updateFeature = function (res, model, id, params, user) {
	flipGeom(params);
	paramsModifyHook(res, model, params, user).then(() => {

		model.update(params, { where: { gid: id } }).then(response => {
			// paramsModifyHook(res, model, params, user); // UNDONE: no longer modifiable
			createLog('UPDATE', model, params.name_fi, user);
			res.json({ 'message': response });
		}).catch(e => {		
			const error = e+"";
			createLog('UPDATE_ERROR', model, undefined, undefined, error);
			res.status(500).json({ 'message': error });
		});
	});
}

exports.deleteFeature = function (res, model, id, name, user) {
	model.destroy({ where: { gid: id } }).then(response => {
		createLog('DELETE', model, name, user);
		res.json({ 'message': response });
	}).catch(e => {
		const error = e+"";
		createLog('DELETE_ERROR', model, undefined, undefined, error);
		res.status(500).json({ 'message': error });
	});
}

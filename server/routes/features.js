const db = require('../../db');
const Model = require('../../db');
const router = require('express').Router();

const config = require('../../config.js');
const imageService = require('../services/imageService.js');
const parseDataUrl = require('parse-data-url');

function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		next(res.status(403));
	}
}


function uploadImage(req, res, next) {
	const imageData = req.body.image;
	const featureType = req.body.featureType;
	const featureId = req.body.featureId;
	const parsed = parseDataUrl(imageData);
	
	const image = parsed.toBuffer();


	if (!featureTypes[featureType]) {
		return res.json({"message": "invalid feature type"});
	};  
	if (!canAccessFeature(req.user, featureType,featureId)) {
		return res.status(403);
	};
	const key = Math.floor(+new Date())+".jpg";

	imageService.uploadS3(key,image).then((data) => {
		console.log(`File uploaded successfully. ${data.Location}`);
		res.json({ 'message': false, 'url': data.Location });
	}).catch(error=>{
			res.json({ 'message': error });
	});
}



router.post('/uploadImage', loggedIn, uploadImage);

const featureTypes={
	"area": 1,
	"point": 2,
	"route": 3,
};

function canAccessFeature(user,featureType,featureId) {
	//TODO: SECURITY:
	return true;
}
module.exports = router

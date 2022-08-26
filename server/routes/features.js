const db = require('../../db');
const Model = require('../../db');
const router = require('express').Router();

const config = require('../../config.js');
const imageService = require('../services/imageService.js');
const parseDataUrl = require('parse-data-url');
const { json } = require('body-parser');

const sendMailService = require('../services/sendmailService');

// TODO: Move
const mapping = {
	approvedArea: "area",
	approvedPoint: "point",
	approvedLine: "route",
	userArea: "area",
	userLine: "route",
	userPoint: "point",
	line: "route",
	area: "area",
	point: "point",
	route: "route",
	polygon: "area",
	linestring: "route"
}

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


	if (!mapping[featureType]) {
		return res.json({ "message": "invalid feature type" });
	};
	canAccessFeature(req, featureType, featureId).then((can) => {
		if (!can) {
			res.json({ 'message': "Not allowed to access this feature" });
			return res.status(403);
		}

		const key = Math.floor(+new Date()) + ".jpg";

		imageService.uploadS3(key, image, req.user.username).then((data) => {
			console.log(`File uploaded successfully. ${data.Location}`);
			res.json({ 'message': false, 'url': data.Location });
		}).catch(error => {
			console.error('uploadImage failure:', error);
			res.json({ 'message': error });
			res.status(500);
		});
	}, (e) => {
		console.error('uploadImage fail:', e);
		res.json({ 'message': e });
		res.status(500);
	});
}

router.post('/uploadImage', loggedIn, uploadImage);

function api_requestFeatureAccess(req, res, next) {
	const reason = req.body.reason;
	const featureId = req.body.featureId;

	if (!mapping[req.body.featureType]) {
		return res.json({ "message": "invalid feature type: " + featureType });
	};
	const featureType = mapping[req.body.featureType];

	return canAccessFeature(req, featureType, featureId).then((can) => {
		if (!can) {
			console.log(req.user.username + " tried to request access by already had: " + JSON.stringify(req.body));
			//res.json({ 'message': "already accessible" });
			//return res.status(409);
		}

		return Model.access_requests.upsert({
			reason: reason,
			featureType: featureType,
			featureId: featureId,
			username: req.user.username,
		}, {}).then(response => {
			res.json({ 'message': response });
			
			Model.access_requests.count().then(count => {
				if (count!=1) return;
				sendMailService.sendAccessRequestNotification({user: req.user});
			});

		}).catch(e => {
			console.error("api_requestFeatureAccess insert fail: ",e);
			const error = e + "";
			Model.logs.create({
				operation: "CREATE",
				target_name: featureId ? featureId : undefined,
				target_table: "access_requests",
				timestamp: new Date,
				msg: error + '',
				executor: req.user.username ? req.user.username : undefined
			});
			res.status(500).json({ 'message': error });
		});
	}, console.error);
}

router.post('/requestFeatureAccess', loggedIn, api_requestFeatureAccess);


function canAccessFeature(req, featureType, featureId) {
	//TODO: SECURITY: Unimplemented
	return new Promise((resolve, reject) => {
		resolve(true);
	});

	if (req.body.isAdmin) return true; //TODO: SECURITY: Checking "admin" from sender's body, what the hell

	// TODO: normalize maintainers?
	const whereClause = { where: { updater_id: { [Op.like]: '%' + req.body.updater_id + '%' } }, gid: featureId };
	const modelName = featureType + "s";
	const modelApprovalName = featureType + "s_approval";

	return Model[modelName].findOne(whereClause).then((res) => {
		if (res === null) {
			return Model[modelApprovalName].findOne(whereClause).then((res) => {
				const can = res === null
			});
		}
		return true;
	});
}
module.exports = router

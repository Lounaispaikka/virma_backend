const db = require('../../db');
const Model = require('../../db');
const config = require('../../config.js');

const fs = require('fs');
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: config.AWSAccessKeyId,
  secretAccessKey: config.AWSSecretKey
});


const { Validator } = require('node-input-validator');

var tmp = require('tmp-promise');



function isOurURL(urlobj) {
  const hostnames = ["virmafipictures.s3.eu-west-1.amazonaws.com","virmafipictures.s3.amazonaws.com","example.com"];
  
  for (const hostname of hostnames) {
    if (urlobj.hostname==hostname) {
      return true;
    }
  }
  return false;

}
function uploadS3(key, image) {
  const v = new Validator({ image: image }, { image: 'required|size:20MB,1kb' });

  return new Promise((resolve, reject) => {

    /*v.check().then((matched) => {
      if (!matched) {
        return reject()
      }*/
      s3.upload({
        Bucket: config.Bucket,
        Key: key,
        Body: image
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
      );/*
    }).catch((e) => {
      return reject(e)
    });*/

  });


}
module.exports = {
  uploadS3: uploadS3,
  isOurURL: isOurURL
};

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
  const hostnames = ["virmafipictures.s3.eu-west-1.amazonaws.com", "virmafipictures.s3.amazonaws.com", "pictures.virma.fi"];

  for (const hostname of hostnames) {
    if (urlobj.hostname == hostname) {
      return true;
    }
  }
  return false;

}

const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
  s3.listObjectsV2(params).promise()
    .then(({ Contents, IsTruncated, NextContinuationToken }) => {
      out.push(...Contents);
      !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));
    })
    .catch(reject);
});

// TODO
function listImages() {
  return listAllKeys({
    Bucket: config.Bucket
  });
}

function deleteImages(keys) {
  return s3.deleteObjects({ Bucket: config.Bucket, Keys: keys }, function (err, data) {
    if (err) console.error(err + " " + err.stack);
  });
}

function uploadS3(key, image, username) {
  const v = new Validator({ image: image }, { image: 'required|size:4MB,1kb' });

  return new Promise((resolve, reject) => {

    v.check().then((matched) => {
      if (!matched) {
        return reject()
      }
      s3.upload({
        Bucket: config.Bucket,
        Key: key,
        ContentType: 'image/jpeg',
        Metadata: {
          "x-uploader": username
        },
        Body: image
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
      );
    }).catch((e) => {
      return reject(e)
    });

  });


}
module.exports = {
  uploadS3: uploadS3,
  listImages: listImages,
  deleteImages: deleteImages,
  isOurURL: isOurURL
};

var multer = require('multer')
const multerS3 = require('multer-s3');

const aws = require('aws-sdk');
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'imagetestservice',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;

///    acl: 'public-read',      // this will be a problem

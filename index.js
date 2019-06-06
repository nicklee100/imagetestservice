const fs = require('fs');
require('dotenv').config()
const PNG = require('pngjs').PNG;
const AmazonCompareScreenshots = require('./imageDiffer')
var multer = require('multer')
var upload = multer()

var upload = require('./s3upload.js')
const singleUpload = upload.single('image')

const aws = require('aws-sdk');
const s3 = new aws.S3();


var save = multer({
  limits: {fieldSize: 25 * 1024 * 1024}
});

aws.config.update({
  secretAccessKey: process.env.AWSSecretKey,
  accessKeyId: process.env.AWSAccessKeyId,
  region: 'us-east-2'

})

//bellow works with sendRawScreenshot & saves to filesystem

function rawImagetoFS(image){
  var buffer = new Buffer(image, 'base64')
  fs.writeFile('images/cnn.png', buffer, 'binary', function(err){
    if(err) console.error(err)
    else console.log('writen');
  })
}

//works
function uploadBaseline(image, metadata){
  const os = metadata.os;
  const browser = metadata.browser;
  const url = metadata.url;
  const snapshotname = metadata.snapshotname;
  const resolution = metadata.resolution;

  const buffer = new Buffer(image, 'base64');

  const data = {
    Key: `baselines/${os}/${browser}/${url}/${snapshotname}`,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    Metadata: {
      "browser": browser,
      "os": os,
      "url": url,
      "resolution": resolution,
    }
  }
  const s3Bucket = new aws.S3({params: {Bucket: 'imagetestservice'}})

  s3Bucket.putObject(data, (err,data) => {
    if(err){
      console.err('error uploading to aws s3', err);
    }  else {
      console.log("succesfully uploaded the image!");
    }
  })
}

//uploads to top object
function uploadS3TopLevel(image,metadata){  //async uploading happening

  const browser = metadata.browser || "Chrome 74"
  const os = metadata.os || "Mac OSX 10.11"
  const url = metadata.url || "uml.edu/student-life"
  const resolution = metadata.resolution || "1200x900"
  const baseline = metadata.baseline || "true"

  const buffer = new Buffer(image, 'base64');
  const data = {
    Key: Date.now().toString(),  //the file name
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    Metadata: {
      "browser": browser,
      "os": os,
      "url": url,
      "resolution": resolution,
      "baseline" : baseline
    }
  }

  const s3Bucket = new aws.S3({params: {Bucket: 'imagetestservice'}})

  s3Bucket.putObject(data, (err,data) => {
    if(err){
      console.err('error uploading to aws s3', err);
    }  else {
      console.log("succesfully uploaded the image!");
    }
  })
}


function uploadTestPromise(image,metaData){
  return new Promise((resolve, reject)=>{
    try {

      const os = metaData.os;
      const browser = metaData.browser;
      const url = metaData.url;
      const resolution = metaData.resolution;
      const snapshotname = metaData.snapshotname;

      const data = {
        Key: `batches/${os}/${browser}/${url}/${snapshotname}`,  //the file name
        Body: image,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        Metadata: {
          "browser": browser,
          "os": os,
          "url": url,
          "resolution": resolution,
        }
      }

      const s3Bucket = new aws.S3({params: {Bucket: 'imagetestservice'}})

      s3Bucket.putObject(data, (err,data) => {
        if(err){
         throw 'error uploading to aws s3!'
        }  else {
          console.log("succesfully uploaded the image!");
        }
      })

      console.log("uploaded to s3")
      resolve();
    }catch(error){
      console.log(error)
      reject(error)
    }
  })
}

function compareBaseline(image){  // hardcoded example
 // const buffer = new Buffer(image, 'base64');
  const s3 = new aws.S3()
  const params = {Bucket: 'imagetestservice', Key: 'screenshot2.png'}
  s3.getObject(params, function(err, data){
    if(err){
      console.err("error:", err);
    } else {
      console.log(data)
      const buffer = new Buffer(data.Body, 'base64');


      // fs.writeFile('./screenshot2.png', buffer, 'binary', (err, data) => {
      //     if(err){console.log('error', err)}
      //     else {
      //       console.log("written")
      //     }
      // })

      // fs.readFile(__dirname+'/screenshot1.png', (err,data) =>{
      //     if(err) throw err;
      //     else {AmazonCompareScreenshots(data,buffer)
      //     }
      // })
    }
  })

}

// convert raw image data to object url
// convert data url to file then append to formdata, openbay vidmob


function getBaselinePromise(metaData){
  return new Promise((resolve, reject)=>{
    try {
      const os = metaData.os;
      const browser = metaData.browser;
      const url = metaData.url;
      const snapshotname = metaData.snapshotname;
      const resolution = metaData.resolution;
      const params = {Bucket: 'imagetestservice', Key: `baselines/${os}/${browser}/${url}/${snapshotname}`}
      s3.getObject(params, function(error, data){
        if(error){
          console.log("error:", error);
          reject(error)
        } else {

          resolve(new Buffer(data.Body, 'base64'));
        }
      })

    } catch(error){
      console.log('error in getbaseline', error)
      reject(error)
    }
  })
}


async function checkWindow(testImage, metaData){  //testImage, metaData,
  //pulls down correct baseline base on testImage name and meta data

  const baselineBuffer = await getBaselinePromise(metaData)
  //fs.writeFile("uml.png", baselineBuffer, 'binary', ()=>{console.log('written')})
  testImageBuffer = new Buffer(testImage, 'base64');
  const diffImage = await AmazonCompareScreenshots(testImageBuffer,baselineBuffer)

   metaData.snapshotname = `test-${metaData.snapshotname}`
   await uploadTestPromise(testImageBuffer, metaData)
   metaData.snapshotname = `base-${metaData.snapshotname}`
   await uploadTestPromise(baselineBuffer, metaData)
   metaData.snapshotname = `diff-${metaData.snapshotname}`
   await uploadTestPromise(diffImage,metaData)

  // uploads baseline, testImage, and Imager differ under batches/data/os/browser/url/ (name-baseline),(name-test),(name-diff)
}

module.exports = {
  uploadBaseline,
  checkWindow,
};

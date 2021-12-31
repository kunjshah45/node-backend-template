const config = require('./mainConfig.js');

module.exports = {
  s3AccessId: config.s3AccessId,
  secretAccessKey: config.s3SecretAccessKey,
  region: config.awsRegion,
  bucketName: config.s3BucketName
}


const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  signatureVersion: "v4",
});
const Sharp = require("sharp");
const width = 1000;

// eslint-disable-next-line
exports.handler = async function (event) {
  if (event.Records[0].eventName !== 'ObjectCreated:Put') {
    return;
  }
  const bucket = event.Records[0].s3.bucket.name;
  const flag = decodeURIComponent(event.Records[0].s3.object.key);
  if (!/\.flag$/.test(flag)) {
    return;
  }
  try {
    console.log("Flag Created:", JSON.stringify(event, null, 2));
    await S3.deleteObject({ Bucket: bucket, Key: flag }).promise();
    const key = flag.slice(0, -5);
    const data = await S3.getObject({ Bucket: bucket, Key: key }).promise();
    const buffer = await Sharp(data.Body)
      .resize(width)
      .toFormat("jpeg")
      .withMetadata()
      .toBuffer();
    await S3.putObject({
      Body: buffer,
      Bucket: bucket,
      ContentType: "image/jpeg",
      Key: key,
    }).promise();
    console.log(`Done`);
  } catch (err) {
    console.error(err);
  }
};

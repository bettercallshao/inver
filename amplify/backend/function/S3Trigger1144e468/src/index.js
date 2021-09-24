const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  signatureVersion: "v4",
});
const Sharp = require("sharp");
const width = 1000;

// eslint-disable-next-line
exports.handler = async function (event) {
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key);
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);
  try {
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

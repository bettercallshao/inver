const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  signatureVersion: "v4",
});
const Sharp = require("sharp");
const width = 1000;
const bucket = "inver3d26a190ded24657b70edf64d2607b6114845-staging";
const inputKey =
  "private/us-east-1%3A95507b16-d06a-4326-a721-7d271960a436/ui/c7100816-3966-43a7-9746-d13720044acf";
const key = decodeURIComponent(inputKey);

(async () => {
  try {
    const data = await S3.getObject({ Bucket: bucket, Key: key }).promise();

    console.log(data);

    const buffer = await Sharp(data.Body)
      .resize(width)
      .toFormat("jpeg")
      .withMetadata()
      .toBuffer();

    console.log(buffer);

    await S3.putObject({
      Body: buffer,
      Bucket: bucket,
      ContentType: "image/jpeg",
      Key: key,
    }).promise();

    console.log(`Resize successful`);
  } catch (err) {
    console.error(err);
  }
})();

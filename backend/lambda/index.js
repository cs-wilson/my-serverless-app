const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { userId, textData, imageBase64 } = JSON.parse(event.body);

  // 上传图片到S3
  const imageKey = `${userId}/${Date.now()}.jpg`;
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageKey,
    Body: Buffer.from(imageBase64, 'base64'),
    ContentType: 'image/jpeg',
  };
  await S3.putObject(uploadParams).promise();

  // 存储文本数据和图片URL到DynamoDB
  const dbParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: userId,
      timestamp: new Date().toISOString(),
      textData: textData,
      imageUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${imageKey}`,
    },
  };
  await DynamoDB.put(dbParams).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
    body: JSON.stringify({ message: 'Data stored successfully' }),
  };
};
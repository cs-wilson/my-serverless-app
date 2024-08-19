
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MyServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 创建S3 Bucket
    const bucket = new s3.Bucket(this, 'UserUploads', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 创建DynamoDB表
    const table = new dynamodb.Table(this, 'UserData', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 创建Lambda函数
    const handler = new lambda.Function(this, 'UserInputHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
    });

    // 赋予Lambda函数权限访问S3和DynamoDB
    bucket.grantReadWrite(handler);
    table.grantReadWriteData(handler);

    // 创建API Gateway并集成Lambda
    const api = new apigateway.LambdaRestApi(this, 'UserInputApi', {
      handler: handler,
      proxy: false,
    });

    const items = api.root.addResource('items');
    items.addMethod('POST');
    items.addMethod('GET');
    items.addCorsPreflight({
      allowOrigins: [ '*' ],
      allowMethods: [ 'GET', 'POST' ]
    });



  }
}
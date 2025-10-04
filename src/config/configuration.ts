export default () => ({
  port: Number(process.env.PORT) || 3000,
  sqs: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    apiVersion: '2012-10-17',
  },
});

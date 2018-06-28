import 'reflect-metadata';
import {cleanUpMetadata} from 'inversify-express-utils';

cleanUpMetadata();

import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const server = awsServerlessExpress.createServer(app);

let handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

export {
  handler,
};

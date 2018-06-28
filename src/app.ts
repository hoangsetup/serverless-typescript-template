import 'reflect-metadata';
require('dotenv').config();
import { InversifyExpressServer } from 'inversify-express-utils';
import {Application} from 'express';

import {container} from './ioc/container';
import {expressConfig} from './config/express.config';
import './ioc/loader';

// create a instance of the server
let server = new InversifyExpressServer(container);

server.setConfig(expressConfig);

let serverInstance: Application = server.build();

export default serverInstance;

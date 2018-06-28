import {Application, NextFunction, Request, Response} from 'express';
import * as bodyParser from 'body-parser';

let expressConfig = (app: Application): void => {
  // Body Parser
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());

  // Other
  app.disable('x-powered-by');

  // Default header
  app.use((req: Request, res: Response, next: NextFunction)  => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
};

export {
  expressConfig,
};

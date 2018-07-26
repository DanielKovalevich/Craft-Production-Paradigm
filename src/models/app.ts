import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';
import * as cors from 'cors';
import {StartGameRouter, GameLogicRouter} from '../routes';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.setRoutes();     
  }

  private config(): void {
    this.app.use(cors({origin: 'http://psu-research.herokuapp.com'}));
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });
    
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:1000000}));
  }

  private setRoutes(): void {
    this.app.use('/startGame', StartGameRouter);
    this.app.use('/gameLogic', GameLogicRouter);
  }
}

export default new App().app;
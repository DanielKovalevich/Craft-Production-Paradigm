import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import {StartGameRouter} from '../routes';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.setRoutes();     
  }

  private config(): void {
    /*this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }),*/
    this.app.use(cors({origin: 'http://localhost:8080'}));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private setRoutes(): void {
    this.app.use('/startGame', StartGameRouter);
  }
}

export default new App().app;
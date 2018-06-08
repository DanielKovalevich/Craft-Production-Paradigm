import * as express from "express";
import * as bodyParser from "body-parser";
import {WelcomeRouter, StartGameRouter} from '../routes';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();        
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private setRoutes(): void {
    this.app.use('/welcome', WelcomeRouter);
    this.app.use('/startGame', StartGameRouter);
  }
}

export default new App().app;
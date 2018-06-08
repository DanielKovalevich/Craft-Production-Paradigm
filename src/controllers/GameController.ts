import * as mongoose from 'mongoose';
import { GameScheme } from '../models/game';
import { Request, Response } from 'express';
import {DatabaseConnector} from '../models/database';

const Game: mongoose.Model<any> = mongoose.model('Game', GameScheme);

export class GameController {
  private db: DatabaseConnector;
  constructor() {
    this.db = new DatabaseConnector();
  }

  public addNewGame(req: Request, res: Response) {
    let requestGame = req.body;
    requestGame.pin = this.generatePin();
    let game = new Game(requestGame);

    this.db.addToDatabase(game);
  }

  private generatePin(): Number {
    let originalPin: Boolean = false;
    let pin: Number = 0;

    while(!originalPin) {
      pin = Math.floor((Math.random() * 9999));
      originalPin = this.db.checkIfPinExists(pin);
    }

    return pin;
  }
}
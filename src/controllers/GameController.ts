import * as mongoose from 'mongoose';
import { GameScheme } from '../models/game';
import { Request, Response } from 'express';
import {DatabaseConnector} from '../models/database';

const Game = mongoose.model('Game', GameScheme);

export class GameController {
  public addNewGame(req: Request, res: Response) {
    let requestGame = req.body;
    requestGame.pin = this.generatePin();
    let game = new Game(requestGame);

    console.log(game);
    /*
    game.save((err, gameInfo) => {
      if(err){
          res.send(err);
      }    
      res.json(gameInfo);
    });*/
  }

  private generatePin() {
    let originalPin: Boolean = false;
    let db: DatabaseConnector = new DatabaseConnector();
    let connection = db.getConnection();
    let gameModel = connection.model('Game', GameScheme);
    while(!originalPin) {
      let pin = Math.floor((Math.random() * 9999));
      console.log(gameModel.find({pin: pin}));
      originalPin = true;
    }
  }
}
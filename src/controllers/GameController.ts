import * as mongoose from 'mongoose';
import { GameScheme } from '../models/game';
import { Request, Response } from 'express';
import {DatabaseConnector} from '../controllers/database';

const Game: mongoose.Model<any> = mongoose.model('Game', GameScheme);

export class GameController {
  private db: DatabaseConnector;
  constructor() {
    this.db = new DatabaseConnector();
  }

  public addNewGame(req: Request) {
    let requestGame = req.body;
    requestGame.pin = this.generatePin();
    let game = new Game(requestGame);
    this.db.addToDatabase(game);
    return requestGame.pin;
  }

  public getGameInfo(pin: Number): any {
    return this.db.getGameObject(pin);
  }

  private generatePin(): Number {    
    let notOriginal: Boolean = true;
    let pin: Number = 0;

    while(notOriginal) {
      pin = Math.floor((Math.random() * 9999));
      notOriginal = this.db.checkIfPinExists(pin);
    }

    return pin;
  }
}

/*
Testing POST
{
	"pin": 1,
	"groupName": "BestTeamEver",
	"status": "waiting",
	"maxPlayers": 2,
	"activePlayers": 1,
	"positions": []
}
*/
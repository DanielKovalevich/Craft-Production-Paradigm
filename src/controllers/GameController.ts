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

  public addNewGame(req: Request) {
    let requestGame = req.body;
    requestGame.pin = this.generatePin();
    let game = new Game(requestGame);
    this.db.addToDatabase(game);
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

/*
THINK ABOUT USING THIS DUMBASS
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
*/
import * as mongoose from 'mongoose';
import {GameScheme} from '../models/game';
import {Request, Response} from 'express';
import {DatabaseConnector} from '../controllers/database';

const Game: mongoose.Model<any> = mongoose.model('Game', GameScheme);

export class GameController {
  private db: DatabaseConnector;
  constructor() {
    this.db = new DatabaseConnector();
  }

  /**
   * Takes data sent and creates database entry
   * @param req 
   */
  public addNewGame(req: Request): Number {
    let requestGame = req.body;
    requestGame.pin = this.generatePin();
    let game = new Game(requestGame);
    this.db.addToDatabase(game);
    return requestGame.pin;
  }

  /**
   * Gets all of the game info from database using the pin
   * @param pin JavaScript decided for me that it will be a string
   */
  public async getGameInfo(pin: string): Promise<any> {
    return await this.db.getGameObject(pin);
  }

  public addActivePlayer(pin: string): void {
    this.db.addActivePlayer(pin);
  }

  public removeActivePlayer(pin: string): void {
    this.db.removeActivePlayer(pin);
  }

  public checkIfPinExists(pin: string, callback: Function) {
    this.db.checkIfPinExists(pin, (result: any) => {
      callback(result);
    });
  }

  public async getPossiblePositions(pin: string): Promise<any> {
    return await this.db.getPossiblePositions(pin);
  }

  /**
   * Generates a pin and makes sure the pin doesn't already exist in the db
   */
  private generatePin(): Number {    
    let notOriginal: Boolean = true;
    let pin: string = Math.floor(Math.random() * 9999).toString();

    while(notOriginal) {
      this.db.checkIfPinExists(pin, (result: any) => {
        notOriginal = result;
        if (notOriginal) pin = Math.floor(Math.random() * 9999).toString();
      });
    }

    return parseInt(pin);
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
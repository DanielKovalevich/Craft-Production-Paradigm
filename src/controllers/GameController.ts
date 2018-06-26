/**
 * This controller handles the game and setup
 */

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
  public async addNewGame(req: Request): Promise<number> {
    let requestGame = req.body;
    requestGame.pin = await this.generatePin();
    let game = new Game(requestGame);
    this.db.addToDatabase(game);
    return requestGame.pin;
  }

  public joinGame(req: Request) {
    this.db.joinGame(req.params.id, req.body.position);
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

  public removeActivePlayer(pin: string, position: string): void {
    this.db.removeActivePlayer(pin, position);
  }

  public async checkIfPinExists(pin: string) {
    return await this.db.checkIfPinExists(pin);
  }

  public async getPossiblePositions(pin: string): Promise<any> {
    return await this.db.getPossiblePositions(pin);
  }

  /**
   * Generates a pin and makes sure the pin doesn't already exist in the db
   */
  private async generatePin(): Promise<number> {    
    let notOriginal: Boolean = true;
    let pin: string = Math.floor(Math.random() * 9999).toString();

    while(notOriginal) {
      let result = await this.db.checkIfPinExists(pin);
      console.log(result);
      notOriginal = result;
      if (notOriginal) pin = Math.floor(Math.random() * 9999).toString();
    }

    return parseInt(pin);
  }
}
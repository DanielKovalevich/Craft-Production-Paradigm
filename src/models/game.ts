/**
 * Game Objects hold all of the states and data for each game
 */
/*export class Game {
  // used to identify the game
  private pin: number;
  // can be: "waiting", "starting"
  private status: string;

  constructor() {
    this.pin = 0;
    this.status = "STARTING";
  }
  public getPin() {
    return this.pin;
  }
}*/

import * as mongoose from 'mongoose';

let scheme = new mongoose.Schema({
    pin: {type: Number, min: 0, max: 9999},
    gameType: {type: Number, min: 0, max: 4},
    period: {type: Number, min: 1, max: 55},
    activeMembers: {type: Number, min: 0, max: 4}
});
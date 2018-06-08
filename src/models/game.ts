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
const Schema = mongoose.Schema;

export const GameScheme = new Schema({
  pin: {type: Number, min: 0, max: 9999},
  groupName: {type: String},
  status: {type: String},
  period: {type: Number, min: 1, max: 55},
  maxPlayers: {type: Number, min: 2, max: 6},
  activePlayers: {type: Number, min: 0, max: 6},
  positions: {type: Schema.Types.Mixed},
  createdDate: {
    type: Date,
    default: Date.now
  }
});
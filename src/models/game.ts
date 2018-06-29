import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const GameScheme = new Schema({
  pin: {type: Number, min: 0, max: 9999},
  groupName: {type: String},
  gameType: {type: String},
  status: {type: String},
  maxPlayers: {type: Number, min: 2, max: 3},
  activePlayers: {type: Number, min: 0, max: 3},
  positions: {type: Schema.Types.Mixed},
  orders: {type: Schema.Types.Mixed},
  createdDate: {
    type: Date,
    default: Date.now
  }
});
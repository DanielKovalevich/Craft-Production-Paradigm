"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.GameScheme = new Schema({
    pin: { type: Number, min: 0, max: 9999 },
    groupName: { type: String },
    gameType: { type: String },
    status: { type: String },
    maxPlayers: { type: Number, min: 2, max: 4 },
    activePlayers: { type: Number, min: 0, max: 4 },
    positions: { type: Schema.Types.Mixed },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

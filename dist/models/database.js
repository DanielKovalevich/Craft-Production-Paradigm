"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const game_1 = require("./game");
class DatabaseConnector {
    constructor() {
        this.url = 'mongodb://localhost/local';
        mongoose.connect(this.url);
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function callback() {
            console.log('Connected to database!');
        });
        this.gameCollection = this.db.collection('gameFiles');
    }
    getConnection() {
        return this.db;
    }
    // TODO: Delete once I test this
    addOneNewEntry() {
        let test = {
            pin: 0,
            groupName: "test",
            status: "waiting",
            maxPlayers: 2,
            activePlayers: 1,
            positions: ["Crafter", "Distributer"]
        };
        let Game = mongoose.model('Game', game_1.GameScheme);
        let game = new Game(test);
        this.gameCollection.insert(game);
    }
    addToDatabase(game) {
        this.gameCollection.insert(game);
    }
    checkIfPinExists(pin) {
        this.gameCollection.findOne({ "pin": pin }, (err, results) => {
            return results != null;
        });
        return false;
    }
    test() {
        console.log('test');
    }
}
exports.DatabaseConnector = DatabaseConnector;

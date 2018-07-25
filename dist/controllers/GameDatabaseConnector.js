"use strict";
/**
 * This class handles all of the Game Settings
 * and anything involved with starting or joining games
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
class GameDatabaseConnector extends database_1.default {
    constructor() {
        super();
    }
    /**
     * This takes the passed in game object and adds it to the database
     * @param game Scheme created earlier
     */
    addToDatabase(game) {
        this.gameCollection.insert(game);
    }
    /**
     * Returns whether or not a pin already exists
     * This is to avoid games from having the same pin
     * @param pin Identifier
     */
    checkIfPinExists(pinNum) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.gameCollection.findOne({ pin: parseInt(pinNum) });
            return result != undefined && result != null;
        });
    }
    /**
     * Increments the active players by one whenever a new player joins the game
     * @param pinNum string
     */
    addActivePlayer(pinNum) {
        this.gameCollection.update({ pin: parseInt(pinNum) }, { $inc: { activePlayers: 1 } });
    }
    /**
     * When someone needs to exit the application, this handles removing the active player
     * it will also delete the database entry, if there are no active players
     * @param pinNum string
     */
    removeActivePlayer(pinNum, position) {
        let query = { pin: parseInt(pinNum) };
        let change = { $inc: { activePlayers: -1 }, $pull: { positions: position } };
        this.gameCollection.update(query, change);
        this.gameCollection.findOne(query, (err, result) => {
            if (err)
                console.log(err);
            if (result.activePlayers <= 0)
                this.gameCollection.deleteOne(query);
        });
    }
    /**
     * Used for when looking up the game by pin
     * @param pinNum string
     */
    getGameObject(pinNum) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.gameCollection.find({ pin: parseInt(pinNum) }).toArray();
            }
            catch (e) {
                return null;
            }
        });
    }
    /**
     * Makes sure two users don't end up with the same positions
     * If no positions are returned, the game is full
     * @param pinNum string
     */
    getPossiblePositions(pinNum) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gameCollection.findOne({ pin: parseInt(pinNum) }, { fields: { positions: 1 } });
        });
    }
    joinGame(pinNum, position) {
        if (position != null && position != "" && position != undefined)
            this.gameCollection.update({ pin: parseInt(pinNum) }, { $push: { positions: position } });
    }
}
exports.GameDatabaseConnector = GameDatabaseConnector;

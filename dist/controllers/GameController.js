"use strict";
/**
 * This controller handles the game and setup
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
const mongoose = require("mongoose");
const game_1 = require("../models/game");
const GameDatabaseConnector_1 = require("../controllers/GameDatabaseConnector");
const Game = mongoose.model('Game', game_1.GameScheme);
class GameController {
    constructor() {
        this.db = new GameDatabaseConnector_1.GameDatabaseConnector();
    }
    /**
     * Takes data sent and creates database entry
     * @param req
     */
    addNewGame(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestGame = req.body;
            requestGame.pin = yield this.generatePin();
            let game = new Game(requestGame);
            this.db.addToDatabase(game);
            return requestGame.pin;
        });
    }
    joinGame(req) {
        this.db.joinGame(req.params.id, req.body.position);
    }
    /**
     * Gets all of the game info from database using the pin
     * @param pin JavaScript decided for me that it will be a string
     */
    getGameInfo(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getGameObject(pin);
        });
    }
    addActivePlayer(pin) {
        this.db.addActivePlayer(pin);
    }
    removeActivePlayer(pin, position) {
        this.db.removeActivePlayer(pin, position);
    }
    checkIfPinExists(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.checkIfPinExists(pin);
        });
    }
    getPossiblePositions(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            let possiblePositions = ['Customer', 'Manufacturer', 'Supplier', 'Assembler'];
            let takenPositions = yield this.db.getPossiblePositions(pin);
            takenPositions.positions.forEach((element) => {
                let index = possiblePositions.indexOf(element);
                if (index != -1)
                    possiblePositions.splice(index, 1);
            });
            return possiblePositions;
        });
    }
    /**
     * Generates a pin and makes sure the pin doesn't already exist in the db
     */
    generatePin() {
        return __awaiter(this, void 0, void 0, function* () {
            let notOriginal = true;
            let pin = Math.floor(Math.random() * 9999).toString();
            while (notOriginal) {
                let result = yield this.db.checkIfPinExists(pin);
                notOriginal = result;
                if (notOriginal)
                    pin = Math.floor(Math.random() * 9999).toString();
            }
            return parseInt(pin);
        });
    }
}
exports.GameController = GameController;

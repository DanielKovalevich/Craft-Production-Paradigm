"use strict";
/**
 * Controller handles all of the game logic
 * i.e. Things that deal with the orders
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
const GameLogicDatabaseConnector_1 = require("../controllers/GameLogicDatabaseConnector");
const order_1 = require("../models/order");
class GameLogicController {
    constructor() {
        this.db = new GameLogicDatabaseConnector_1.GameLogicDatabaseConnector();
    }
    placeOrder(pin, modelType) {
        let order = new order_1.default(parseInt(pin));
        order.setModelType(modelType);
        order.setStage('Manufacturer');
        this.db.addOrder(order.toJSON());
    }
    getOrders(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getOrders(pin);
        });
    }
    addSupplyOrder(pin, orderId, order) {
        this.db.addSupplyOrder(pin, orderId, order);
    }
    getSupplyOrder(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getSupplyOrder(pin, orderId);
        });
    }
    updatePieces(pin, orderId, pieces) {
        return this.db.updatePieces(pin, orderId, pieces);
    }
    updateAssembledModel(pin, orderId, model) {
        return this.db.updateAssembledModel(pin, orderId, model);
    }
    getAssembledModel(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getAssembledModel(pin, orderId);
        });
    }
    getManufacturerRequest(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getManufacturerRequest(pin, orderId);
        });
    }
    updateManufacturerRequest(pin, orderId, request) {
        return this.db.updateManufacturerRequest(pin, orderId, request);
    }
    rejectOrder(pin, orderId) {
        return this.db.rejectOrder(pin, orderId);
    }
}
exports.GameLogicController = GameLogicController;

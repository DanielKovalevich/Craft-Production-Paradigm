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
    placeOrder(pin, modelType, generated, max, skew) {
        if (generated == true) {
            this.generateOrders(pin, max, skew);
        }
        else {
            let order = new order_1.default(pin);
            order.setModelType(modelType);
            order.setStage('Manufacturer');
            this.db.addOrder(order.toJSON());
        }
    }
    generateOrders(pin, max, skew) {
        for (let i = 0; i < max; i++) {
            let order = new order_1.default(pin);
            let type = '';
            switch (Math.ceil(this.normalDistribution(skew))) {
                case 1:
                    type = 'super';
                    break;
                case 2:
                    type = 'race';
                    break;
                case 3:
                    type = 'RC';
                    break;
                case 4:
                    type = 'yellow';
                    break;
            }
            order.setModelType(type);
            order.setStage('Manufacturer');
            this.db.addOrder(order.toJSON());
        }
    }
    /**
     * Found on StackOverflow
     * https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
     * @param min
     * @param max
     * @param skew
     */
    normalDistribution(skew) {
        const min = 0;
        const max = 4;
        var u = 0, v = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0)
            num = this.normalDistribution(skew); // resample between 0 and 1 if out of range
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
        return num;
    }
    getOrders(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getOrders(pin);
        });
    }
    addSupplyOrder(pin, orderId, order, colors) {
        this.db.addSupplyOrder(pin, orderId, order, colors);
    }
    getSupplyOrder(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getSupplyOrder(pin, orderId);
        });
    }
    getColors(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.db.getColors(pin, orderId);
            return result;
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

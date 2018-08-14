"use strict";
/**
 * This class handles any actual game logic
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
class GameLogicDatabaseConnector extends database_1.default {
    constructor() {
        super();
    }
    /**
     * This will add the order to the game object's array
     * @param pin
     * @param order JSON Object that holds all the order details
     */
    addOrder(order) {
        this.orderCollection.insert(order);
    }
    /**
     * Gets all of the orders that are part of the same session
     * @param pin
     */
    getOrders(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderCollection.find({ pin: parseInt(pin) }).toArray();
            }
            catch (e) {
                return new Array();
            }
        });
    }
    // This happens at the supplier stage
    // I don't know why I have two functions that essentially do the same thing (idgaf at this point)
    // fixed: they no longer do the same thing
    addSupplyOrder(pin, orderId, order, colors) {
        let time = new Date().getTime();
        let update = { $set: { supplyOrders: order, colors: colors, lastModified: time, stage: 'Assembler' } };
        this.orderCollection.update({ pin: parseInt(pin), _id: orderId }, update);
    }
    getSupplyOrder(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orders = yield this.orderCollection.findOne({ pin: parseInt(pin), _id: orderId }, { fields: { supplyOrders: 1, _id: 0 } });
                return orders.supplyOrders;
            }
            catch (e) {
                return new Array();
            }
        });
    }
    getColors(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = { pin: parseInt(pin), _id: orderId };
                let fields = { fields: { colors: 1, _id: 0 } };
                let result = yield this.orderCollection.findOne(query, fields);
                return yield result.colors;
            }
            catch (e) {
                console.log(e);
                return new Array();
            }
        });
    }
    // this is used in the assembler stage
    updatePieces(pin, orderId, pieces) {
        if (pieces != null && pieces != undefined) {
            let time = new Date().getTime();
            let update = { $set: { supplyOrders: pieces, lastModified: time } };
            this.orderCollection.update({ pin: parseInt(pin), _id: orderId }, update);
            return 200;
        }
        return 400;
    }
    /**
     * Updates the assembled model in the database
     * Also assumed that the process has been finishes so status is changed
     * and time completed is recorded
     * @param pin
     * @param orderId
     * @param model
     */
    updateAssembledModel(pin, orderId, model) {
        if (model != null && model != undefined) {
            let time = new Date().getTime();
            let update = { $set: { assembledModel: model, status: 'Completed', finishedTime: time, stage: 'Inspection' } };
            this.orderCollection.update({ pin: parseInt(pin), _id: orderId }, update);
            return 200;
        }
        return 400;
    }
    getAssembledModel(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = { pin: parseInt(pin), _id: orderId.toString() };
                let projection = { fields: { assembledModel: 1, _id: 0 } };
                return yield this.orderCollection.findOne(query, projection);
            }
            catch (e) {
                console.log(e);
                return new Object();
            }
        });
    }
    getManufacturerRequest(pin, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let request = yield this.orderCollection.findOne({ pin: parseInt(pin), _id: orderId }, { fields: { manufacturerReq: 1, _id: 0 } });
                return request.manufacturerReq;
            }
            catch (e) {
                return new Array();
            }
        });
    }
    /**
     * Once the manufacturer request is sent, the time modified is updated and the game goes to the supplier stage
     * @param pin
     * @param orderId
     * @param request
     */
    updateManufacturerRequest(pin, orderId, request) {
        if (request != null && request != undefined) {
            let time = new Date().getTime();
            let update = { $set: { manufacturerReq: request, stage: 'Supplier', lastModified: time } };
            this.orderCollection.update({ pin: parseInt(pin), _id: orderId }, update);
            return 200;
        }
        return 400;
    }
    /**
     * If the user doesn't approve the model, the game will turn back to the supplier stage
     * @param pin
     * @param orderId
     */
    rejectOrder(pin, orderId) {
        try {
            let time = new Date().getTime();
            let update = { $set: { status: 'In Progress', stage: 'Supplier', lastModified: time, assembledModel: null, finishedTime: -1 } };
            this.orderCollection.update({ pin: parseInt(pin), _id: orderId }, update);
            return 200;
        }
        catch (e) {
            return 400;
        }
    }
}
exports.GameLogicDatabaseConnector = GameLogicDatabaseConnector;

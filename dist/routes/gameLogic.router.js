"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameLogicController_1 = require("../controllers/GameLogicController");
const router = express_1.Router();
const controller = new GameLogicController_1.GameLogicController();
router.post('/sendOrder', (req, res) => {
    controller.placeOrder(req.body.pin, req.body.model);
    res.status(200).send('OK');
});
router.get('/getOrders/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getOrders(req.params.id));
}));
router.post('/sendSupplyOrder/:id', (req, res) => {
    controller.addSupplyOrder(req.params.id, req.body.id, req.body.order, req.body.colors);
    res.status(200).send('OK');
});
router.get('/getSupplyOrder/:id/:orderId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getSupplyOrder(req.params.id, req.params.orderId));
}));
router.get('/colors/:id/:orderId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let result = yield controller.getColors(req.params.id, req.params.orderId);
    res.send(result);
}));
router.post('/updatePieces/:id/:orderId', (req, res) => {
    res.send(controller.updatePieces(req.params.id, req.params.orderId, req.body.pieces));
});
router.post('/sendAssembledModel/:id/:orderId', (req, res) => {
    console.log('Assembled model has been sent');
    res.send(controller.updateAssembledModel(req.params.id, req.params.orderId, req.body.model));
});
router.get('/getAssembledModel/:id/:orderId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getAssembledModel(req.params.id, req.params.orderId));
}));
router.get('/getManufacturerRequest/:id/:orderId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getManufacturerRequest(req.params.id, req.params.orderId));
}));
router.post('/updateManufacturerRequest/:id/:orderId', (req, res) => {
    res.send(controller.updateManufacturerRequest(req.params.id, req.params.orderId, req.body.request));
});
router.post('/rejectOrder/:id/:orderId', (req, res) => {
    res.send(controller.rejectOrder(req.params.id, req.params.orderId));
});
exports.GameLogicRouter = router;

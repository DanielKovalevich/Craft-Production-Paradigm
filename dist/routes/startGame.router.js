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
const GameController_1 = require("../controllers/GameController");
const cors = require("cors");
const router = express_1.Router();
const controller = new GameController_1.GameController();
router.post('/', cors(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    let result = { "pin": 0 };
    result.pin = yield controller.addNewGame(req);
    res.send(result);
}));
router.post('/joinGame/:id', (req, res) => {
    controller.joinGame(req);
    res.status(200).send('OK');
});
router.get('/getGameInfo/:id', cors(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getGameInfo(req.params.id));
}));
router.get('/addActivePlayer/:id', cors(), (req, res) => {
    controller.addActivePlayer(req.params.id);
    res.sendStatus(200);
});
router.get('/removeActivePlayer/:id/:position', cors(), (req, res) => {
    controller.removeActivePlayer(req.params.id, req.params.position);
    res.sendStatus(200);
});
router.get('/checkIfPinExists/:id', cors(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.checkIfPinExists(req.params.id));
}));
router.get('/getPossiblePositions/:id', cors(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(yield controller.getPossiblePositions(req.params.id));
}));
// if I create self-contained functions, I can write them like this
//router.post('/', new GameController().addNewGame);
exports.StartGameRouter = router;

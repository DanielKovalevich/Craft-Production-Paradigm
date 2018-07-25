"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes_1 = require("../routes");
class App {
    constructor() {
        this.app = express();
        this.config();
        this.setRoutes();
    }
    config() {
        /*this.app.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }),*/
        this.app.use(cors({ origin: 'http://psu-research.herokuapp.com' }));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 }));
    }
    setRoutes() {
        this.app.use('/startGame', routes_1.StartGameRouter);
        this.app.use('/gameLogic', routes_1.GameLogicRouter);
    }
}
exports.default = new App().app;

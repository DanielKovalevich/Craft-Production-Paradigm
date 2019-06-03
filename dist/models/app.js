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
        this.app.use(cors({ origin: '*' }));
        this.app.use((req, res, next) => {
            // res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });
        this.app.use(bodyParser.json({ limit: '500mb' }));
        this.app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 10000000 }));
        this.app.use(bodyParser({ limit: '50mb' }));
    }
    setRoutes() {
        this.app.use('/startGame', routes_1.StartGameRouter);
        this.app.use('/gameLogic', routes_1.GameLogicRouter);
    }
}
exports.default = new App().app;

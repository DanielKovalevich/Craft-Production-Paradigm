"use strict";
// This is only a test that I am using as an example
// TODO: Remove when finished with project
/* app/routes/welcome.controller.ts */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (req, res) {
    res.send('Hello, World!');
});
router.get('/:name', function (req, res) {
    var name = req.params.name;
    res.send("Hello, " + name);
});
exports.WelcomeController = router;

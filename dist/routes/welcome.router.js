"use strict";
// This is only a test that I am using as an example
// TODO: Remove when finished with project
/* app/routes/welcome.controller.ts */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.send('Hello, World!');
});
router.get('/:name', (req, res) => {
    let { name } = req.params;
    res.send(`Hello, ${name}`);
});
exports.WelcomeRouter = router;

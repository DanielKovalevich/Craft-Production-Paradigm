"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const app = express();
const port = Number(process.env.PORT) || 8080;
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/welcome', WelcomeController);
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

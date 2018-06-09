"use strict";
const express = require("express");
const path = require("path");
const app = express();
const port = Number(process.env.PORT) || 8080;

let startGameController = require('./routes/startGame');
let indexController = require('./routes/indexController');
let welcomeController = require('./routes/welcome');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/startGame', startGameController);
//app.use('/welcome', welcomeController);
//app.use('/', indexController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

"use strict";
const express = require("express");
const path = require("path");
const app = express();
const port = Number(process.env.PORT) || 8080;

let startGameRouter = require('./routes/startGame.router');
let builderRouter = require('./routes/builder.router');
let customerRouter = require('./routes/customer.router');
let supplierRouter = require('./routes/supplier.router');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/startGame', startGameRouter);
app.use('/builder', builderRouter);
app.use('/customer', customerRouter);
app.use('/supplier', supplierRouter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});

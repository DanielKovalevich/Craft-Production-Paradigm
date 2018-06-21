const express = require('express');
const path = require("path");
let router = express.Router();

router.get('/:pin', function (req, res) {
  res.sendFile(path.join(__dirname + '/../public/startGame.html'));
});

module.exports = router;
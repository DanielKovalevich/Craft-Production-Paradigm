var express = require('express');
let router = express.Router();
const path = require("path");

router.get('/:pin', function (req, res) {
  res.sendFile(path.join(__dirname, '/../public/builder.html'));
});

module.exports = router;
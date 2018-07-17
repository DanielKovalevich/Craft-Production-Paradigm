var express = require('express');
let router = express.Router();
const path = require("path");

router.get('/:pin/:orderId', function (req, res) {
  res.sendFile(path.join(__dirname, '/../public/viewer.html'));
});

module.exports = router;
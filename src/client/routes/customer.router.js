var express = require('express');
let router = express.Router();
const path = require("path");

router.get('/:pin', function (req, res) {
  res.sendFile(path.join(__dirname, '/../public/customer.html'));
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log('test');
  res.redirect('/welcome');
});

module.exports = router;
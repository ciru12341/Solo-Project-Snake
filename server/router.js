const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/Leaderboard', controller.getAllUsers);
router.post('/Leaderboard', controller.insertScore);

module.exports = router;

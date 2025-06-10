const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/events', controller.getAllEvents);
router.post('/events', controller.insertEvent);

module.exports = router;

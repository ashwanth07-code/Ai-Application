const express = require('express');
const router = express.Router();
const spamController = require('../controllers/spamController');
const { validateSpamRequest } = require('../middleware/validation');

router.post('/', validateSpamRequest, spamController.checkSpam);

module.exports = router;
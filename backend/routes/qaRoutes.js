const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { validateQARequest } = require('../middleware/validation');

router.post('/', validateQARequest, qaController.answerQuestion);

module.exports = router;
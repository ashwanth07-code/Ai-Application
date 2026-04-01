const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatRequest } = require('../middleware/validation');

router.post('/', validateChatRequest, chatController.processMessage);

module.exports = router;
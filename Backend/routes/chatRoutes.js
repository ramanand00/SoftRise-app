const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth, isEmailVerified } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);
router.use(isEmailVerified);

// Chat routes
router.post('/', chatController.createChat);
router.get('/', chatController.getUserChats);
router.get('/:chatId', chatController.getChatById);
router.post('/:chatId/messages', chatController.sendMessage);
router.patch('/:chatId/read', chatController.markAsRead);
router.patch('/:chatId', chatController.updateGroupChat);
router.delete('/:chatId', chatController.deleteChat);
router.get('/:chatId/stats', chatController.getChatStats);

module.exports = router; 
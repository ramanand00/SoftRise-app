const Chat = require('../models/Chat');
const User = require('../models/User');

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { type, participants, groupName } = req.body;
    
    // Validate participants
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res.status(400).json({ error: 'Invalid participants' });
    }

    // Add current user to participants if not included
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id);
    }

    const chatData = {
      type,
      participants,
      admins: [req.user._id]
    };

    if (type === 'group') {
      if (!groupName) {
        return res.status(400).json({ error: 'Group name is required' });
      }
      chatData.groupName = groupName;
    }

    const chat = await Chat.create(chatData);
    await chat.populate('participants', 'firstName lastName avatar');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's chats
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.getUserChats(req.user._id);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'firstName lastName avatar')
      .populate('messages.sender', 'firstName lastName avatar');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { content, attachments } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messageData = {
      sender: req.user._id,
      content,
      attachments,
      readBy: [{ user: req.user._id }]
    };

    await chat.addMessage(messageData);
    await chat.populate('messages.sender', 'firstName lastName avatar');

    // Emit socket event for real-time updates
    req.io.to(chat._id.toString()).emit('newMessage', {
      chat: chat._id,
      message: chat.messages[chat.messages.length - 1]
    });

    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await chat.markAsRead(req.user._id);
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update group chat
exports.updateGroupChat = async (req, res) => {
  try {
    const { groupName, participants } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.admins.includes(req.user._id)) {
      return res.status(403).json({ error: 'Only admins can update group' });
    }

    if (groupName) {
      chat.groupName = groupName;
    }

    if (participants) {
      // Validate new participants
      const validParticipants = await User.find({ _id: { $in: participants } });
      if (validParticipants.length !== participants.length) {
        return res.status(400).json({ error: 'Invalid participants' });
      }
      chat.participants = participants;
    }

    await chat.save();
    await chat.populate('participants', 'firstName lastName avatar');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.type === 'group' && !chat.admins.includes(req.user._id)) {
      return res.status(403).json({ error: 'Only admins can delete group chat' });
    }

    chat.isActive = false;
    await chat.save();

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat statistics
exports.getChatStats = async (req, res) => {
  try {
    const stats = await Chat.getChatStats(req.params.chatId);
    if (!stats) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
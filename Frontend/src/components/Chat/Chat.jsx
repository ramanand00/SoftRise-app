import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socketRef.current.on('newMessage', handleNewMessage);
    socketRef.current.on('userTyping', handleUserTyping);
    socketRef.current.on('userStoppedTyping', handleUserStoppedTyping);
    socketRef.current.on('userPresenceUpdate', handleUserPresence);

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  // Fetch user's chats
  useEffect(() => {
    fetchChats();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats');
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      if (selectedChat?._id) {
        socketRef.current.emit('leaveChat', selectedChat._id);
      }

      const response = await api.get(`/chats/${chat._id}`);
      setSelectedChat(response.data);
      socketRef.current.emit('joinChat', chat._id);
      
      // Mark messages as read
      await api.patch(`/chats/${chat._id}/read`);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const handleNewMessage = (data) => {
    if (selectedChat && selectedChat._id === data.chat) {
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, data.message],
      }));
    }
    
    // Update chat list
    setChats(prev => prev.map(chat => 
      chat._id === data.chat
        ? { ...chat, lastMessage: data.message }
        : chat
    ));
  };

  const handleUserTyping = (data) => {
    setTyping(prev => ({
      ...prev,
      [data.chatId]: data.userName,
    }));
  };

  const handleUserStoppedTyping = (data) => {
    setTyping(prev => {
      const updated = { ...prev };
      delete updated[data.chatId];
      return updated;
    });
  };

  const handleUserPresence = (data) => {
    setOnlineUsers(prev => {
      const updated = new Set(prev);
      if (data.status === 'online') {
        updated.add(data.userId);
      } else {
        updated.delete(data.userId);
      }
      return updated;
    });
  };

  const handleMessageSend = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      await api.post(`/chats/${selectedChat._id}/messages`, {
        content: message,
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', { chatId: selectedChat._id });
    
    // Clear typing indicator after delay
    setTimeout(() => {
      socketRef.current.emit('stopTyping', { chatId: selectedChat._id });
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" height="calc(100vh - 200px)" gap={2}>
      {/* Chat List */}
      <Paper sx={{ width: 300, overflow: 'auto' }}>
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat._id}
              button
              selected={selectedChat?._id === chat._id}
              onClick={() => handleChatSelect(chat)}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={!onlineUsers.has(chat.participants[0]._id)}
                >
                  <Avatar src={chat.type === 'group' ? chat.groupAvatar : chat.participants[0].avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.type === 'group' ? chat.groupName : `${chat.participants[0].firstName} ${chat.participants[0].lastName}`}
                secondary={chat.lastMessage?.content}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Messages */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Box p={2} borderBottom={1} borderColor="divider">
              <Typography variant="h6">
                {selectedChat.type === 'group'
                  ? selectedChat.groupName
                  : `${selectedChat.participants[0].firstName} ${selectedChat.participants[0].lastName}`}
              </Typography>
              {typing[selectedChat._id] && (
                <Typography variant="caption" color="textSecondary">
                  {typing[selectedChat._id]} is typing...
                </Typography>
              )}
            </Box>

            {/* Messages */}
            <Box flex={1} overflow="auto" p={2}>
              {selectedChat.messages.map((msg) => (
                <Box
                  key={msg._id}
                  alignSelf={msg.sender._id === user._id ? 'flex-end' : 'flex-start'}
                  mb={1}
                >
                  <Paper
                    sx={{
                      p: 1,
                      backgroundColor: msg.sender._id === user._id ? 'primary.light' : 'grey.100',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box p={2} borderTop={1} borderColor="divider">
              <Box display="flex" gap={1}>
                <IconButton size="small">
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleMessageSend();
                    handleTyping();
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleMessageSend}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="h6" color="textSecondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Chat; 
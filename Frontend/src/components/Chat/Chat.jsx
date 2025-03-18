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
  Container,
  Button,
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Course Chat</Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'grey.50',
          }}
        >
          <List>
            {selectedChat?.messages.map((message, index) => (
              <React.Fragment key={message._id}>
                <ListItem
                  sx={{
                    flexDirection:
                      message.sender._id === user._id ? 'row-reverse' : 'row',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={message.sender.avatar} alt={message.sender.name} />
                  </ListItemAvatar>
                  <Paper
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      ml: message.sender._id === user._id ? 0 : 1,
                      mr: message.sender._id === user._id ? 1 : 0,
                      backgroundColor:
                        message.sender._id === user._id
                          ? 'primary.main'
                          : 'background.paper',
                      color:
                        message.sender._id === user._id ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {message.sender.name}
                    </Typography>
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 1,
                        color:
                          message.sender._id === user._id
                            ? 'rgba(255,255,255,0.7)'
                            : 'text.secondary',
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Paper>
                </ListItem>
                {index < selectedChat.messages.length - 1 && (
                  <Divider variant="middle" sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleMessageSend();
            handleTyping();
          }}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small">
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!message.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 
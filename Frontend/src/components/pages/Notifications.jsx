import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import MessageIcon from '@mui/icons-material/Message';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { format } from 'date-fns';

const mockNotifications = [
  {
    id: 1,
    type: 'course',
    title: 'New Course Content Available',
    message: 'New lecture added to Web Development Masterclass',
    timestamp: new Date(2024, 2, 7, 14, 30),
    read: false,
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'John Doe commented on your post',
    timestamp: new Date(2024, 2, 7, 12, 15),
    read: true,
  },
  {
    id: 3,
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'React Project submission due in 2 days',
    timestamp: new Date(2024, 2, 6, 9, 45),
    read: false,
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'Completed 5 courses! Keep up the great work!',
    timestamp: new Date(2024, 2, 5, 16, 20),
    read: true,
  },
];

const NotificationItem = ({ notification, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'course':
        return <SchoolIcon />;
      case 'message':
        return <MessageIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'achievement':
        return <EmojiEventsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'course':
        return 'primary';
      case 'message':
        return 'info';
      case 'assignment':
        return 'warning';
      case 'achievement':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <ListItem
      sx={{
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        borderRadius: 1,
        mb: 1,
      }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(notification.id)}>
          <DeleteOutlineIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${getColor(notification.type)}.main` }}>
          {getIcon(notification.type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" component="span">
              {notification.title}
            </Typography>
            {!notification.read && (
              <Chip
                label="New"
                color="primary"
                size="small"
                sx={{ height: 20 }}
              />
            )}
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};

const Notifications = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filterNotifications = () => {
    if (selectedTab === 0) return notifications;
    const types = ['course', 'message', 'assignment', 'achievement'];
    return notifications.filter((n) => n.type === types[selectedTab - 1]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Badge badgeContent={unreadCount} color="primary" sx={{ mr: 2 }}>
          <NotificationsIcon fontSize="large" />
        </Badge>
        <Typography variant="h4">Notifications</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="Courses" />
          <Tab label="Messages" />
          <Tab label="Assignments" />
          <Tab label="Achievements" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {filterNotifications().length > 0 ? (
          <List>
            {filterNotifications().map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onDelete={handleDelete}
                />
                {index < filterNotifications().length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications; 
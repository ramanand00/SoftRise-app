import { useState, useEffect } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  MoreVert,
  Circle as CircleIcon,
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import api from '../services/api'
import { useWebSocket } from '../context/WebSocketContext'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const socket = useWebSocket()

  useEffect(() => {
    fetchNotifications()

    if (socket) {
      socket.on('new-notification', handleNewNotification)
    }

    return () => {
      if (socket) {
        socket.off('new-notification')
      }
    }
  }, [socket])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])
  }

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget)
    setSelectedNotification(notification)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedNotification(null)
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`)
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
    handleMenuClose()
  }

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      setNotifications(notifications.filter(n => n._id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
    handleMenuClose()
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <List>
        {notifications.map((notification) => (
          <Box key={notification._id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, notification)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={notification.read}
                >
                  <Avatar src={notification.sender?.avatar}>
                    {notification.sender?.name[0]}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={notification.message}
                secondary={formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => markAsRead(selectedNotification?._id)}>
          Mark as read
        </MenuItem>
        <MenuItem onClick={() => deleteNotification(selectedNotification?._id)}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Notifications 
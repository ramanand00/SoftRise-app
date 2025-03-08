import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { getCurrentUser, updateUserProfile } from '../services/authService'

const Profile = () => {
  const { userId } = useParams()
  const currentUser = getCurrentUser()
  const isOwnProfile = !userId || userId === currentUser?.id
  
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    skills: '',
    education: '',
    interests: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${userId || currentUser.id}`)
      setProfile(response.data)
      setFormData({
        name: response.data.name,
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
        skills: response.data.skills?.join(', ') || '',
        education: response.data.education || '',
        interests: response.data.interests?.join(', ') || '',
      })
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        interests: formData.interests.split(',').map(interest => interest.trim()),
      }
      
      await updateUserProfile(updatedData)
      setSuccessMessage('Profile updated successfully')
      setEditMode(false)
      fetchProfile() // Refresh profile data
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                src={profile?.avatar}
                sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
              />
              {isOwnProfile && !editMode && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Grid>
            
            <Grid item xs={12} md={8}>
              {editMode ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                  <TextField
                    fullWidth
                    label="Skills (comma-separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Interests (comma-separated)"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mr: 1 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    {profile?.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {profile?.bio || 'No bio available'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Education: {profile?.education || 'Not specified'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills: {profile?.skills?.join(', ') || 'Not specified'}
                  </Typography>
                  <Typography variant="subtitle1">
                    Interests: {profile?.interests?.join(', ') || 'Not specified'}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab icon={<TimelineIcon />} label="Activity" />
            <Tab icon={<SchoolIcon />} label="Courses" />
            <Tab icon={<GroupIcon />} label="Connections" />
          </Tabs>

          {activeTab === 0 && (
            <Typography variant="body1">
              Recent activity will be displayed here
            </Typography>
          )}
          
          {activeTab === 1 && (
            <Typography variant="body1">
              Enrolled courses will be displayed here
            </Typography>
          )}
          
          {activeTab === 2 && (
            <Typography variant="body1">
              Connections will be displayed here
            </Typography>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Container>
  )
}

export default Profile 
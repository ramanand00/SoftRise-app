import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material'
import {
  Search,
  PlayCircle,
  People,
  Notifications,
  TrendingUp,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import api from '../services/api'

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}))

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}))

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [trendingVideos, setTrendingVideos] = useState([])
  const [popularCourses, setPopularCourses] = useState([])
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    fetchTrendingContent()
  }, [])

  const fetchTrendingContent = async () => {
    try {
      const [videosRes, coursesRes, usersRes] = await Promise.all([
        api.get('/videos/trending'),
        api.get('/courses/popular'),
        api.get('/users/active'),
      ])
      setTrendingVideos(videosRes.data)
      setPopularCourses(coursesRes.data)
      setActiveUsers(usersRes.data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${searchQuery}`)
  }

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h2" gutterBottom>
            Welcome to SoftRiseup
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your platform for learning and connecting with other students
          </Typography>
          
          <SearchBar component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Search for courses, videos, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: '10px' }}>
              <Search />
            </IconButton>
          </SearchBar>
        </Container>
      </HeroSection>

      <Container>
        {/* Featured Cards Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/path-to-your-image.jpg"
                alt="Learn"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Learn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access high-quality courses and learning materials
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/path-to-your-image.jpg"
                alt="Connect"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Connect
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Network with other students and professionals
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/community')}
                >
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/path-to-your-image.jpg"
                alt="Grow"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Grow
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your progress and achieve your goals
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/dashboard')}
                >
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
          Trending Content
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 4 }}
        >
          <Tab icon={<PlayCircle />} label="Trending Videos" />
          <Tab icon={<TrendingUp />} label="Popular Courses" />
          <Tab icon={<People />} label="Active Users" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {trendingVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.description}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PlayCircle />}
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/videos/${video._id}`)}
                    >
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {popularCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {activeUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={user.avatar} alt={user.name} />
                      <Box>
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default Home 
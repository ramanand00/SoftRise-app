import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  PlayCircle,
  Lock,
  Payment,
} from '@mui/icons-material'
import api from '../services/api'

const CourseEnroll = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`)
      setCourse(response.data)
    } catch (error) {
      setError('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${courseId}/enroll`)
      navigate(`/courses/${courseId}/learn`)
    } catch (error) {
      setError('Failed to enroll in course')
    }
  }

  const handlePayment = async () => {
    try {
      const response = await api.post(`/payments/create-session`, {
        courseId: courseId
      })
      window.location.href = response.data.url // Redirect to payment page
    } catch (error) {
      setError('Payment initialization failed')
    }
  }

  if (loading) return <Box>Loading...</Box>
  if (!course) return <Box>Course not found</Box>

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              What you'll learn:
            </Typography>
            <List>
              {course.learningObjectives?.map((objective, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={objective} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Course Content:
            </Typography>
            <List>
              {course.content?.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {course.enrolled ? <PlayCircle /> : <Lock />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    secondary={`Duration: ${item.duration}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Course Price
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${course.price}
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle /></ListItemIcon>
                  <ListItemText primary="Full lifetime access" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle /></ListItemIcon>
                  <ListItemText primary="Certificate of completion" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircle /></ListItemIcon>
                  <ListItemText primary="24/7 support" />
                </ListItem>
              </List>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={course.price > 0 ? <Payment /> : null}
                onClick={course.price > 0 ? handlePayment : handleEnroll}
                sx={{ mt: 2 }}
              >
                {course.price > 0 ? 'Buy Now' : 'Enroll Now'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CourseEnroll 
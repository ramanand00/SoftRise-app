import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import {
  PlayCircleOutline as VideoIcon,
  Description as DocumentIcon,
  Quiz as QuizIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  School as InstructorIcon,
  Grade as LevelIcon,
  People as EnrolledIcon,
  Star as StarIcon,
  Person,
  Timer,
} from '@mui/icons-material';
import api from '../services/api';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${slug}`);
        setCourse(response.data);
      } catch (error) {
        setError('Failed to load course details. Please try again later.');
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await api.post(`/courses/${course._id}/enroll`);
      navigate(`/courses/${slug}/learn`);
    } catch (error) {
      setError('Failed to enroll in the course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'quiz':
        return <QuizIcon />;
      default:
        return <VideoIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5">Course not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Course Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${course.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {course.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 1 }} />
                {course.instructor.firstName} {course.instructor.lastName}
              </Box>
              <Box display="flex" alignItems="center">
                <Timer sx={{ mr: 1 }} />
                {formatDuration(course.duration)}
              </Box>
              <Box display="flex" alignItems="center">
                <StarIcon />
                {course.averageRating || 0}
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleEnroll}
              sx={{ alignSelf: 'flex-start', mt: 2 }}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          </Paper>
        </Grid>

        {/* Course Description */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              About This Course
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              What You'll Learn
            </Typography>
            <List>
              {course.learningOutcomes.map((outcome, index) => (
                <ListItem key={index}>
                  <ListItemIcon>✓</ListItemIcon>
                  <ListItemText primary={outcome} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Course Content */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            {course.lessons.map((lesson, index) => (
              <Accordion key={lesson._id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography flex={1}>
                      {index + 1}. {lesson.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mr={2}>
                      {formatDuration(lesson.content.duration)}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {getLessonIcon(lesson.content.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={lesson.title}
                        secondary={lesson.description}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(lesson.content.duration)}
                      </Typography>
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Prerequisites */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Prerequisites
            </Typography>
            <List>
              {course.prerequisites.map((prerequisite, index) => (
                <ListItem key={index}>
                  <ListItemIcon>•</ListItemIcon>
                  <ListItemText primary={prerequisite} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Course Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Details
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Timer />
                </ListItemIcon>
                <ListItemText primary="Duration" secondary={formatDuration(course.duration)} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LevelIcon />
                </ListItemIcon>
                <ListItemText primary="Level" secondary={course.level} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EnrolledIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Students"
                  secondary={course.enrolledStudents?.length || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Rating"
                  secondary={`${course.averageRating || 0} (${course.totalRatings} reviews)`}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Instructor Info */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Instructor
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <InstructorIcon sx={{ mr: 1 }} />
              <Typography>
                {course.instructor.firstName} {course.instructor.lastName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {course.instructor.bio}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails; 
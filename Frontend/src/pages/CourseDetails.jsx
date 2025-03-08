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
} from '@mui/icons-material';
import api from '../services/api';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [slug]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${slug}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await api.post(`/courses/${course._id}/enroll`);
      navigate(`/courses/${slug}/learn`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
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

  if (!course) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5">Course not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Course Header */}
      <Box py={4} bgcolor="primary.main" color="white" mt={-2}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {course.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Rating value={course.averageRating || 0} readOnly precision={0.5} />
                <Typography>({course.totalRatings} ratings)</Typography>
                <Chip
                  label={course.level}
                  color={
                    course.level === 'Beginner'
                      ? 'success'
                      : course.level === 'Intermediate'
                      ? 'warning'
                      : 'error'
                  }
                />
                <Chip
                  icon={<TimeIcon />}
                  label={formatDuration(course.duration)}
                />
                <Chip
                  icon={<EnrolledIcon />}
                  label={`${course.enrolledStudents?.length || 0} enrolled`}
                />
              </Stack>
              <Typography variant="subtitle1">
                Created by {course.instructor.firstName} {course.instructor.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${course.price}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                  <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
                    30-Day Money-Back Guarantee
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} mt={2}>
          {/* Course Content */}
          <Grid item xs={12} md={8}>
            {/* What You'll Learn */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                What You'll Learn
              </Typography>
              <Grid container spacing={2}>
                {course.learningOutcomes.map((outcome, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <ListItem>
                      <ListItemIcon>✓</ListItemIcon>
                      <ListItemText primary={outcome} />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
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

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Instructor Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
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

            {/* Course Stats */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Course Stats
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Duration"
                    secondary={formatDuration(course.duration)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LevelIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Level"
                    secondary={course.level}
                  />
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
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default CourseDetails; 
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Avatar,
  Rating,
  Paper,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const StyledHeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  borderRadius: '0 0 50px 50px',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const CourseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const Home = () => {
  const theme = useTheme();

  const featuredCourses = [
    {
      id: 1,
      title: 'Web Development Masterclass',
      instructor: 'John Doe',
      image: '/images/web-dev.jpg',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      instructor: 'Jane Smith',
      image: '/images/data-science.jpg',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Mobile App Development',
      instructor: 'Mike Johnson',
      image: '/images/mobile-dev.jpg',
      rating: 4.7,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Wilson',
      role: 'Student',
      avatar: '/avatars/sarah.jpg',
      content: 'This platform has transformed my learning experience. The courses are well-structured and the social features make learning more engaging.',
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Professional',
      avatar: '/avatars/david.jpg',
      content: 'The certification process is rigorous and valuable. Employers recognize these certificates, which helped me advance in my career.',
    },
  ];

  return (
    <Box>
      <StyledHeroSection>
        <Container>
          <Typography variant="h2" gutterBottom>
            Learn, Share, Grow Together
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your Journey to Success Starts Here
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 4 }}
            startIcon={<PlayCircleOutlineIcon />}
          >
            Start Learning
          </Button>
        </Container>
      </StyledHeroSection>

      <Container sx={{ mt: -5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quality Courses
              </Typography>
              <Typography color="text.secondary">
                Access premium courses from industry experts
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <GroupIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Social Learning
              </Typography>
              <Typography color="text.secondary">
                Connect with peers and share knowledge
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Certifications
              </Typography>
              <Typography color="text.secondary">
                Earn recognized certificates
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Featured Courses
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} md={4} key={course.id}>
              <CourseCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image}
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {course.instructor}
                  </Typography>
                  <Rating value={course.rating} precision={0.1} readOnly />
                </CardContent>
              </CourseCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          What Our Students Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={6} key={testimonial.id}>
              <TestimonialCard elevation={2}>
                <Avatar
                  src={testimonial.avatar}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Typography variant="body1" paragraph>
                  "{testimonial.content}"
                </Typography>
                <Typography variant="h6">
                  {testimonial.name}
                </Typography>
                <Typography color="text.secondary">
                  {testimonial.role}
                </Typography>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 
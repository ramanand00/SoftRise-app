import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.common.white,
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
}));

const mockUser = {
  name: 'John Doe',
  avatar: '/path/to/avatar.jpg',
  role: 'Student',
  bio: 'Passionate about learning and technology. Currently pursuing web development and machine learning courses.',
  location: 'New York, USA',
  joinDate: 'March 2024',
  stats: {
    coursesCompleted: 12,
    certificatesEarned: 8,
    uploadedContent: 15,
    totalHoursLearned: 156,
  },
};

const mockCourses = [
  {
    id: 1,
    title: 'Web Development Masterclass',
    progress: 85,
    image: '/path/to/course1.jpg',
    instructor: 'Jane Smith',
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    progress: 60,
    image: '/path/to/course2.jpg',
    instructor: 'Dr. Robert Johnson',
  },
];

const mockAchievements = [
  {
    id: 1,
    title: 'Course Champion',
    description: 'Completed 10 courses with distinction',
    icon: <EmojiEventsIcon />,
    date: 'Feb 2024',
  },
  {
    id: 2,
    title: 'Content Creator',
    description: 'Uploaded 10+ educational resources',
    icon: <VideoLibraryIcon />,
    date: 'Mar 2024',
  },
];

const mockContent = [
  {
    id: 1,
    type: 'video',
    title: 'React Hooks Tutorial',
    views: 1200,
    uploadDate: '2024-03-01',
    thumbnail: '/path/to/video1.jpg',
  },
  {
    id: 2,
    type: 'notes',
    title: 'JavaScript ES6 Features',
    downloads: 450,
    uploadDate: '2024-02-28',
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProfileHeader elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={mockUser.avatar}
              sx={{ width: 120, height: 120, border: '4px solid white' }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {mockUser.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {mockUser.role} • {mockUser.location}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {mockUser.bio}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </ProfileHeader>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              {mockUser.stats.coursesCompleted}
            </Typography>
            <Typography color="text.secondary">Courses Completed</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              {mockUser.stats.certificatesEarned}
            </Typography>
            <Typography color="text.secondary">Certificates Earned</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <VideoLibraryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              {mockUser.stats.uploadedContent}
            </Typography>
            <Typography color="text.secondary">Uploaded Content</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h4" gutterBottom>
              {mockUser.stats.totalHoursLearned}h
            </Typography>
            <Typography color="text.secondary">Total Hours Learned</Typography>
          </StatsCard>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Courses" />
          <Tab label="Achievements" />
          <Tab label="Uploaded Content" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {mockCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Instructor: {course.instructor}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {course.progress}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <List>
            {mockAchievements.map((achievement) => (
              <React.Fragment key={achievement.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {achievement.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={achievement.title}
                    secondary={
                      <>
                        {achievement.description}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Earned: {achievement.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {mockContent.map((content) => (
              <Grid item xs={12} md={6} key={content.id}>
                <Card>
                  {content.type === 'video' && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={content.thumbnail}
                      alt={content.title}
                    />
                  )}
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      {content.type === 'video' ? (
                        <VideoLibraryIcon color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="h6">{content.title}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Chip
                        label={content.type === 'video' ? 'Video' : 'Notes'}
                        color="primary"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {content.type === 'video'
                          ? `${content.views} views`
                          : `${content.downloads} downloads`}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Profile; 
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const mockVideos = [
  {
    id: 1,
    title: 'Introduction to React Hooks',
    thumbnail: '/path/to/thumbnail1.jpg',
    duration: '15:30',
    views: 1200,
    likes: 245,
    author: 'John Doe',
    category: 'Web Development',
    date: '2024-03-01',
  },
  {
    id: 2,
    title: 'Machine Learning Basics',
    thumbnail: '/path/to/thumbnail2.jpg',
    duration: '22:15',
    views: 850,
    likes: 180,
    author: 'Jane Smith',
    category: 'Data Science',
    date: '2024-02-28',
  },
  // Add more mock videos as needed
];

const categories = [
  'All',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'UI/UX Design',
];

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadClose = () => {
    setUploadDialogOpen(false);
    setUploadProgress(0);
    setUploading(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              handleUploadClose();
            }, 1000);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);
    }
  };

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h4">E-Learning Videos</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search videos..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadClick}
              >
                Upload Video
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 1,
                    borderRadius: '4px 0 0 0',
                  }}
                >
                  {video.duration}
                </Box>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                    color: 'white',
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  {video.author}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Chip
                    label={video.category}
                    size="small"
                    color="primary"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VisibilityIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {video.views}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUpIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {video.likes}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={uploadDialogOpen} onClose={handleUploadClose}>
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Select a video file to upload. Supported formats: MP4, WebM
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Choose File
            <VisuallyHiddenInput
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
            />
          </Button>
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Videos; 
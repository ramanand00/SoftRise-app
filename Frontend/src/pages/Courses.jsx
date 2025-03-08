import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Rating,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Stack,
  Pagination,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import api from '../services/api'

const Courses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Cloud Computing',
    'Artificial Intelligence',
    'Cybersecurity',
    'DevOps',
    'UI/UX Design',
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced']
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100-' },
  ]

  useEffect(() => {
    fetchCourses()
  }, [searchTerm, category, level, priceRange, page])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/courses', {
        params: {
          search: searchTerm,
          category,
          level,
          priceRange,
          page,
          limit: 8,
        },
      })
      setCourses(response.data.courses)
      setTotalPages(Math.ceil(response.data.total / 8))
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (slug) => {
    navigate(`/courses/${slug}`)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    return `${hours} hours`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search and Filters */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  label="Level"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {levels.map((lvl) => (
                    <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  label="Price Range"
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Course Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                cursor: 'pointer',
              }}
              onClick={() => handleCourseClick(course.slug)}
            >
              <CardMedia
                component="img"
                height="160"
                image={course.thumbnail}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                  }}
                >
                  {course.description}
                </Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <Chip
                    size="small"
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
                    size="small"
                    label={formatDuration(course.duration)}
                    icon={<AccessTimeIcon />}
                  />
                </Stack>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={course.averageRating || 0}
                      readOnly
                      size="small"
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary" ml={0.5}>
                      ({course.totalRatings || 0})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${course.price}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  )
}

export default Courses 
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Rating,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import api from '../services/api'

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [courseId])

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/reviews`)
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async () => {
    try {
      await api.post(`/courses/${courseId}/reviews`, newReview)
      setOpenDialog(false)
      setNewReview({ rating: 0, comment: '' })
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5">Course Reviews</Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
          >
            Write a Review
          </Button>
        </Box>

        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={review.user.avatar} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">
                        {review.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(review.createdAt), { 
                          addSuffix: true 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => {
                  setNewReview({ ...newReview, rating: newValue })
                }}
                size="large"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ 
                  ...newReview, 
                  comment: e.target.value 
                })}
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitReview}
              variant="contained"
              disabled={!newReview.rating || !newReview.comment}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

export default CourseReviews 
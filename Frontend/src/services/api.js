import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
    })
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    })
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Courses API
export const courses = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getCurriculum: (courseId) => api.get(`/courses/${courseId}/curriculum`),
  getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  updateProgress: (courseId, data) => api.put(`/courses/${courseId}/progress`, data),
}

// Chat API
export const chat = {
  getChats: () => api.get('/chats'),
  getById: (chatId) => api.get(`/chats/${chatId}`),
  create: (data) => api.post('/chats', data),
  sendMessage: (chatId, data) => api.post(`/chats/${chatId}/messages`, data),
  markAsRead: (chatId) => api.patch(`/chats/${chatId}/read`),
}

export default api 
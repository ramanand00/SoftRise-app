import api from './api'

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    throw error
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  } catch (error) {
    throw error
  }
}

export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    throw error
  }
} 
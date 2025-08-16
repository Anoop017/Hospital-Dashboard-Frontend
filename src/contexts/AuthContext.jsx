import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Configure axios defaults
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  axios.defaults.baseURL = API_BASE_URL
  axios.defaults.withCredentials = true

  // Add request interceptor to handle token from localStorage if needed
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data.user)
      // Store token in localStorage for fallback
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
    } catch (error) {
      console.log('Not authenticated')
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      setUser(response.data)
      // Store token in localStorage for fallback
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      setUser(response.data)
      // Store token in localStorage for fallback
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      toast.success('Registration successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setUser(null)
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Clear local state even if server logout fails
      setUser(null)
      localStorage.removeItem('token')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      await axios.put('/api/auth/profile', profileData)
      await checkAuthStatus() // Refresh user data
      toast.success('Profile updated successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
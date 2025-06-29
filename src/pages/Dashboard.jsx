import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  User, 
  Clock, 
  TrendingUp,
  Activity,
  Heart,
  Shield,
  Settings
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/auth/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBasedQuickLinks = () => {
    const links = [
      { to: '/edit-profile', label: 'Edit Profile', icon: Settings, color: 'bg-blue-500' }
    ]

    if (user?.role === 'patient') {
      links.push(
        { to: '/my-appointments', label: 'My Appointments', icon: Calendar, color: 'bg-green-500' },
        { to: '/view-doctors', label: 'View Doctors', icon: Stethoscope, color: 'bg-purple-500' }
      )
    }

    if (user?.role === 'doctor' || user?.role === 'admin') {
      links.push({ to: '/patients', label: 'Patients', icon: Users, color: 'bg-orange-500' })
    }

    if (user?.role === 'admin') {
      links.push(
        { to: '/manage-users', label: 'Manage Users', icon: User, color: 'bg-red-500' },
        { to: '/manage-doctors', label: 'Manage Doctors', icon: Stethoscope, color: 'bg-indigo-500' },
        { to: '/manage-patients', label: 'Manage Patients', icon: Users, color: 'bg-pink-500' },
        { to: '/manage-appointments', label: 'Manage Appointments', icon: Calendar, color: 'bg-teal-500' },
        { to: '/system-stats', label: 'System Stats', icon: TrendingUp, color: 'bg-yellow-500' }
      )
    }

    return links
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    let greeting = 'Good morning'
    
    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon'
    } else if (hour >= 17) {
      greeting = 'Good evening'
    }

    return `${greeting}, ${user?.name}!`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome to your {user?.role} dashboard
        </p>
      </motion.div>

      {/* Stats Cards - Admin Only */}
      {user?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Stethoscope className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDoctors}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRoleBasedQuickLinks().map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={link.to}
                className="dashboard-card block hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${link.color} bg-opacity-10`}>
                    <link.icon className={`w-6 h-6 ${link.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {link.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access {link.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="dashboard-card"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Welcome to the Hospital Dashboard
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                You've successfully logged in
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Account Status
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your account is active and secure
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard 
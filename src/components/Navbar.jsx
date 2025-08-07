import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Home,
  Calendar,
  Users,
  Stethoscope,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getRoleBasedLinks = () => {
    if (!user) return []

    const links = [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/edit-profile', label: 'Edit Profile', icon: Settings }
    ];

    if (user.role === 'patient') {
      links.push(
        { to: '/my-appointments', label: 'My Appointments', icon: Calendar },
        { to: '/view-doctors', label: 'View Doctors', icon: Stethoscope }
      );
    }

    if (user.role === 'doctor' || user.role === 'admin') {
      // Removed 'Patients' for more space
      // links.push({ to: '/patients', label: 'Patients', icon: Users });
    }

    if (user.role === 'admin') {
      links.push(
        // Removed 'Manage Users' and 'Manage Patients' for more space
        { to: '/manage-doctors', label: 'Manage Doctors', icon: Stethoscope },
        { to: '/manage-appointments', label: 'Manage Appointments', icon: Calendar },
        { to: '/system-stats', label: 'System Stats', icon: BarChart3 }
      );
    }

    return links;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Title */}
        <div className="flex flex-col items-center py-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Hospital Dashboard
            </span>
          </Link>
        </div>

        {/* Navigation Bar Below Title */}
        <div className="flex flex-wrap justify-center items-center space-x-2 py-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  ({user.role})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-secondary"
              >
                Register
              </Link>
              <Link
                to="/admin-login"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-primary-600 border border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  ({user.role})
                </span>
              </div>
              
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
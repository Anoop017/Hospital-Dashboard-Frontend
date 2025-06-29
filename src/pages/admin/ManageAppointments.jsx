import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const ManageAppointments = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all appointments in the system
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-8 text-center"
      >
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Manage Appointments
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This page will allow admins to view, create, edit, and manage all appointments in the system.
        </p>
      </motion.div>
    </div>
  )
}

export default ManageAppointments 
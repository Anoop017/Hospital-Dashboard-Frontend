import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

const SystemStats = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          System Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View comprehensive system analytics and statistics
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-8 text-center"
      >
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          System Statistics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This page will display comprehensive analytics including user growth, appointment trends, and system performance metrics.
        </p>
      </motion.div>
    </div>
  )
}

export default SystemStats 
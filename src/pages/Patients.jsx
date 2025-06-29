import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Phone, Calendar, MapPin, Search, User } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients')
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Patients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your assigned patients
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </motion.div>

      {/* Patients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-6"
      >
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="card p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {patient.user?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.user?.email}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.phone}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {patient.address?.city}, {patient.address?.state}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Gender:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {patient.gender}
                    </p>
                  </div>
                  
                  {patient.bloodGroup && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Blood Group:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {patient.bloodGroup}
                      </p>
                    </div>
                  )}
                </div>

                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Allergies:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Medical History:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {patient.medicalHistory.join(', ')}
                    </p>
                  </div>
                )}

                {patient.emergencyContact && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Emergency Contact:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card p-8 text-center"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No patients found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria.' : 'You don\'t have any assigned patients yet.'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Patients 
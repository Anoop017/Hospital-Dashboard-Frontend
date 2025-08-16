import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, CheckCircle, XCircle, Edit, Eye } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const DoctorAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/doctor')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: newStatus })
      toast.success(`Appointment ${newStatus} successfully`)
      fetchAppointments() // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment'
      toast.error(message)
    }
  }

  const handleEditAppointment = async (appointmentData) => {
    try {
      await axios.put(`/api/appointments/${selectedAppointment._id}`, appointmentData)
      toast.success('Appointment updated successfully')
      setShowEditModal(false)
      setSelectedAppointment(null)
      fetchAppointments()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment'
      toast.error(message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'no-show': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredAppointments = appointments.filter(appointment => 
    !filterStatus || appointment.status === filterStatus
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
          My Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view all your patient appointments
        </p>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        {filteredAppointments.map((appointment, index) => (
          <motion.div
            key={appointment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {appointment.patient?.user?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reason: {appointment.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowViewModal(true)
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setShowEditModal(true)
                    }}
                    className="p-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                    title="Edit Appointment"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                        className="p-2 text-green-400 hover:text-green-600 dark:hover:text-green-300"
                        title="Confirm Appointment"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                      className="p-2 text-green-400 hover:text-green-600 dark:hover:text-green-300"
                      title="Mark as Completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAppointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card p-8 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterStatus ? `No ${filterStatus} appointments.` : 'You have no appointments scheduled.'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <ViewAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowViewModal(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowEditModal(false)
            setSelectedAppointment(null)
          }}
          onSave={handleEditAppointment}
        />
      )}
    </div>
  )
}

// View Appointment Modal Component
const ViewAppointmentModal = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Name
              </label>
              <p className="text-gray-900 dark:text-white">{appointment.patient?.user?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date & Time
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Visit
              </label>
              <p className="text-gray-900 dark:text-white">{appointment.reason}</p>
            </div>

            {appointment.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <p className="text-gray-900 dark:text-white">{appointment.notes}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <p className="text-gray-900 dark:text-white capitalize">{appointment.status}</p>
            </div>

            {appointment.diagnosis && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Diagnosis
                </label>
                <p className="text-gray-900 dark:text-white">{appointment.diagnosis}</p>
              </div>
            )}

            {appointment.prescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prescription
                </label>
                <p className="text-gray-900 dark:text-white">{appointment.prescription}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Edit Appointment Modal Component
const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: appointment.status,
    diagnosis: appointment.diagnosis || '',
    prescription: appointment.prescription || '',
    notes: appointment.notes || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows="3"
                placeholder="Enter diagnosis..."
                className="input-field w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prescription
              </label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                rows="3"
                placeholder="Enter prescription..."
                className="input-field w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Enter additional notes..."
                className="input-field w-full resize-none"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments

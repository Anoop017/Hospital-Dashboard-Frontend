import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import MyAppointments from './pages/MyAppointments'
import DoctorAppointments from './pages/DoctorAppointments'
import ViewDoctors from './pages/ViewDoctors'
import Patients from './pages/Patients'
import ManageUsers from './pages/admin/ManageUsers'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManagePatients from './pages/admin/ManagePatients'
import ManageAppointments from './pages/admin/ManageAppointments'
import SystemStats from './pages/admin/SystemStats'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/my-appointments" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MyAppointments />
                </ProtectedRoute>
              } />
              
              <Route path="/doctor-appointments" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              } />
              
              <Route path="/view-doctors" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <ViewDoctors />
                </ProtectedRoute>
              } />
              
              <Route path="/patients" element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <Patients />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/manage-users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-doctors" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageDoctors />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-patients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManagePatients />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-appointments" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageAppointments />
                </ProtectedRoute>
              } />
              
              <Route path="/system-stats" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemStats />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
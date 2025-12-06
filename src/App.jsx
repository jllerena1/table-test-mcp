import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DataTable from './components/DataTable'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <ProtectedRoute>
          <DataTable />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  )
}

export default App


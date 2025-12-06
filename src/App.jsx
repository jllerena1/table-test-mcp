import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DataTable from './components/DataTable'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <ProtectedRoute>
            <DataTable />
          </ProtectedRoute>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App


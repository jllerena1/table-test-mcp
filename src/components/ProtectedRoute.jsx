import React, { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Login from './Login'
import { useConfetti } from './Confetti'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const triggerConfetti = useConfetti()
  const hasCelebratedRef = useRef(false)
  const prevAuthStateRef = useRef(false)

  // Trigger confetti when user successfully logs in
  useEffect(() => {
    // Only trigger if user just became authenticated (was not authenticated before)
    if (isAuthenticated && !prevAuthStateRef.current && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true
      // Small delay to ensure UI is ready
      setTimeout(() => {
        triggerConfetti()
      }, 300)
    }
    prevAuthStateRef.current = isAuthenticated
    
    // Reset celebration flag when user logs out
    if (!isAuthenticated) {
      hasCelebratedRef.current = false
    }
  }, [isAuthenticated, triggerConfetti])

  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#6f6f6f'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return <>{children}</>
}

export default ProtectedRoute

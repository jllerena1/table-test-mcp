import React, { createContext, useContext, useState } from 'react'
import db from '../config/instadb'

const AuthContext = createContext(null)

// Wrapper around InstantDB's useAuth to provide a consistent API
export const AuthProvider = ({ children }) => {
  let instantAuth
  try {
    instantAuth = db.useAuth()
  } catch (error) {
    console.error('Error initializing auth:', error)
    // Fallback auth state
    instantAuth = {
      user: null,
      isLoading: false,
      error: error,
    }
  }
  const [pendingEmail, setPendingEmail] = useState(null)
  
  // Map InstantDB auth to our expected format
  const auth = {
    isAuthenticated: !!instantAuth.user,
    user: instantAuth.user ? {
      id: instantAuth.user.id,
      email: instantAuth.user.email || instantAuth.user.id,
    } : null,
    loading: instantAuth.loading,
    pendingEmail,
    // InstantDB magic code auth methods
    requestCode: async (email) => {
      try {
        await db.auth.sendMagicCode({ email })
        setPendingEmail(email)
        return { 
          success: true, 
          message: 'Verification code sent to your email. Please check your inbox.' 
        }
      } catch (error) {
        console.error('Error requesting code:', error)
        const errorMessage = error.body?.message || error.message || 'Failed to send verification code'
        throw new Error(errorMessage)
      }
    },
    verifyCode: async (code) => {
      try {
        if (!pendingEmail) {
          throw new Error('No pending email. Please request a code first.')
        }
        await db.auth.signInWithMagicCode({ email: pendingEmail, code })
        setPendingEmail(null)
        return { success: true }
      } catch (error) {
        console.error('Error verifying code:', error)
        const errorMessage = error.body?.message || error.message || 'Failed to verify code'
        throw new Error(errorMessage)
      }
    },
    logout: async () => {
      try {
        await db.auth.signOut()
        setPendingEmail(null)
      } catch (error) {
        console.error('Error logging out:', error)
      }
    },
    // Expose InstantDB auth directly for advanced usage
    instantAuth,
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import React, { createContext, useContext, useState } from 'react'
import db from '../config/instadb'

const AuthContext = createContext(null)

// Wrapper around InstantDB's useAuth to provide a consistent API
export const AuthProvider = ({ children }) => {
  // Validate db is initialized before using useAuth
  if (!db) {
    console.error('[AuthContext] ERROR: db is not initialized')
  }
  if (db && typeof db.useAuth !== 'function') {
    console.error('[AuthContext] ERROR: db.useAuth is not a function')
  }

  let instantAuth
  try {
    instantAuth = db?.useAuth?.() || null
    
    // If useAuth returns undefined or null, use fallback
    if (!instantAuth) {
      console.warn('[AuthContext] useAuth returned null/undefined, using fallback')
      throw new Error('InstantDB useAuth returned null or undefined')
    }
    
    console.log('[AuthContext] useAuth initialized successfully')
  } catch (error) {
    console.error('[AuthContext] Error initializing auth:', error)
    // Fallback auth state with correct property names
    instantAuth = {
      user: null,
      loading: false, // Changed from isLoading to loading
      error: error,
    }
  }
  const [pendingEmail, setPendingEmail] = useState(null)
  
  // Safely extract values with fallbacks
  const user = instantAuth?.user ?? null
  const loading = instantAuth?.loading ?? instantAuth?.isLoading ?? false
  
  // Map InstantDB auth to our expected format
  const auth = {
    isAuthenticated: !!user,
    user: user ? {
      id: user.id,
      email: user.email || user.id,
    } : null,
    loading: loading,
    pendingEmail,
    // InstantDB magic code auth methods
    requestCode: async (email) => {
      try {
        if (!db || !db.auth) {
          throw new Error('InstantDB is not initialized. Please check your configuration.')
        }
        if (typeof db.auth.sendMagicCode !== 'function') {
          throw new Error('sendMagicCode is not available. Check InstantDB SDK version.')
        }
        
        console.log('[AuthContext] Requesting magic code for:', email)
        await db.auth.sendMagicCode({ email })
        setPendingEmail(email)
        console.log('[AuthContext] Magic code sent successfully')
        return { 
          success: true, 
          message: 'Verification code sent to your email. Please check your inbox.' 
        }
      } catch (error) {
        console.error('[AuthContext] Error requesting code:', error)
        const errorMessage = error.body?.message || error.message || 'Failed to send verification code'
        throw new Error(errorMessage)
      }
    },
    verifyCode: async (code) => {
      try {
        if (!pendingEmail) {
          throw new Error('No pending email. Please request a code first.')
        }
        if (!db || !db.auth) {
          throw new Error('InstantDB is not initialized. Please check your configuration.')
        }
        if (typeof db.auth.signInWithMagicCode !== 'function') {
          throw new Error('signInWithMagicCode is not available. Check InstantDB SDK version.')
        }
        
        console.log('[AuthContext] Verifying code for:', pendingEmail)
        await db.auth.signInWithMagicCode({ email: pendingEmail, code })
        setPendingEmail(null)
        console.log('[AuthContext] Code verified successfully')
        return { success: true }
      } catch (error) {
        console.error('[AuthContext] Error verifying code:', error)
        const errorMessage = error.body?.message || error.message || 'Failed to verify code'
        throw new Error(errorMessage)
      }
    },
    logout: async () => {
      try {
        if (!db || !db.auth) {
          console.warn('[AuthContext] Cannot logout: InstantDB not initialized')
          return
        }
        await db.auth.signOut()
        setPendingEmail(null)
        console.log('[AuthContext] Logged out successfully')
      } catch (error) {
        console.error('[AuthContext] Error logging out:', error)
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

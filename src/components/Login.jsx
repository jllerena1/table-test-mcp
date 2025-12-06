import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

const Login = () => {
  const { requestCode, verifyCode, pendingEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState('email') // 'email' or 'code'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode

  // Apply dark mode class to body
  useEffect(() => {
    const body = document.body
    if (darkMode) {
      body?.classList.add('dark-mode')
    } else {
      body?.classList.remove('dark-mode')
    }
    
    // Cleanup on unmount
    return () => {
      body?.classList.remove('dark-mode')
    }
  }, [darkMode])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await requestCode(email)
      setSuccess(result.message || 'Verification code sent to your email')
      setStep('code')
    } catch (err) {
      console.error('Login error details:', err)
      const errorMessage = err.message || 'Failed to send verification code. Please try again.'
      setError(errorMessage)
      
      // Show additional help for connection errors
      if (errorMessage.includes('Unable to connect') || errorMessage.includes('Failed to fetch')) {
        setError(`${errorMessage}\n\nPlease check:\n- Your internet connection\n- InstaDB API URL configuration\n- CORS settings`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleCodePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setCode(newCode)
      // Focus last input
      const lastInput = document.getElementById('code-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const codeString = code.join('')
    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)

    try {
      await verifyCode(codeString)
      // Success - AuthContext will handle the redirect
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.')
      // Clear code on error
      setCode(['', '', '', '', '', ''])
      const firstInput = document.getElementById('code-0')
      if (firstInput) firstInput.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-container">
      {/* Dark Mode Toggle */}
      <button
        className="theme-toggle-button"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          color: darkMode ? '#f4f4f4' : '#161616',
          backgroundColor: darkMode ? '#393939' : '#ffffff',
          border: `1px solid ${darkMode ? '#525252' : '#d1d1d1'}`,
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#525252' : '#f4f4f4'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#393939' : '#ffffff'
        }}
      >
        <span style={{ fontSize: '18px' }}>{darkMode ? '☀️' : '🌙'}</span>
        <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
      </button>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Sign in to access your data table</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="form-input"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                Enter the 6-digit code sent to
              </label>
              <div className="email-display">{pendingEmail || email}</div>
              <div className="code-inputs-container">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    onPaste={index === 0 ? handleCodePaste : undefined}
                    className="code-input"
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading || code.join('').length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="back-button"
              disabled={loading}
            >
              ← Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login

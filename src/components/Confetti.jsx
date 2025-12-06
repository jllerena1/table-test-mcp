import React, { useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'

/**
 * Simple Confetti component that fires when mounted
 * Perfect for celebrating successful login!
 */
const Confetti = ({ 
  onComplete,
  options = {}
}) => {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    // Default confetti options - celebration style!
    const defaultOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      ...options
    }

    // Fire confetti from center
    confetti({
      ...defaultOptions,
      origin: { x: 0.5, y: 0.6 }
    })

    // Fire from left side
    setTimeout(() => {
      confetti({
        ...defaultOptions,
        origin: { x: 0.2, y: 0.6 },
        angle: 60
      })
    }, 100)

    // Fire from right side
    setTimeout(() => {
      confetti({
        ...defaultOptions,
        origin: { x: 0.8, y: 0.6 },
        angle: 120
      })
    }, 200)

    // Callback when done
    if (onComplete) {
      setTimeout(() => {
        onComplete()
      }, 3000)
    }
  }, [onComplete, options])

  return null
}

/**
 * Hook to trigger confetti programmatically
 */
export const useConfetti = () => {
  const triggerConfetti = useCallback((options = {}) => {
    const defaultOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      ...options
    }

    // Center burst
    confetti({
      ...defaultOptions,
      origin: { x: 0.5, y: 0.6 }
    })

    // Left side
    setTimeout(() => {
      confetti({
        ...defaultOptions,
        origin: { x: 0.2, y: 0.6 },
        angle: 60
      })
    }, 100)

    // Right side
    setTimeout(() => {
      confetti({
        ...defaultOptions,
        origin: { x: 0.8, y: 0.6 },
        angle: 120
      })
    }, 200)
  }, [])

  return triggerConfetti
}

export default Confetti

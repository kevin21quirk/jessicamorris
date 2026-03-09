import React, { useState, useEffect } from 'react'

const SplashScreen = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setOpacity(1)
    }, 100)

    // Flash after 2.5 seconds
    const flashTimer = setTimeout(() => {
      setFlash(true)
    }, 2500)

    // Remove flash
    const unflashTimer = setTimeout(() => {
      setFlash(false)
    }, 2700)

    // Fade out after 3 seconds
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0)
    }, 3000)

    // Complete and remove splash screen
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3500)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(flashTimer)
      clearTimeout(unflashTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
      style={{
        opacity: opacity,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <img
        src="/jm_remove_back.png"
        alt="Jessica Morris"
        className="max-w-[80vw] max-h-[80vh] object-contain"
        style={{
          filter: flash ? 'brightness(2)' : 'brightness(1)',
          transition: 'filter 0.1s ease-in-out'
        }}
      />
    </div>
  )
}

export default SplashScreen

import { useState, useEffect } from 'react'
import { styles, globalStyles } from '../styles/homeStyles'
import { weatherData } from '../data/homeData'

import HomeNav        from '../components/home/HomeNav'
import HeroSection    from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import CtaBand        from '../components/home/CtaBand'
import HomeFooter     from '../components/home/HomeFooter'

export default function Home() {
  const [activeCity, setActiveCity] = useState(0)
  const [time, setTime] = useState(new Date())
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouse = (e) => setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity((prev) => (prev + 1) % weatherData.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const gradX = 40 + mousePos.x * 20
  const gradY = 40 + mousePos.y * 20

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      {/* Animated background */}
      <div style={{
        ...styles.bgGradient,
        background: `radial-gradient(ellipse at ${gradX}% ${gradY}%, rgba(138,60,255,0.3) 0%, transparent 60%),
                     radial-gradient(ellipse at ${100 - gradX}% ${100 - gradY}%, rgba(0,180,255,0.2) 0%, transparent 55%),
                     linear-gradient(160deg, #080611 0%, #0a0818 40%, #070515 100%)`
      }} />

      {/* Floating orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      {/* Grid overlay */}
      <div style={styles.grid} />

      <HomeNav />

      <HeroSection
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        time={time}
      />

      <FeaturesSection />
      <CtaBand />
      <HomeFooter />
    </div>
  )
}
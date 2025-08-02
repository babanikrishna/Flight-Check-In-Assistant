import React, { useRef, useEffect, useState } from 'react'
import Globe from 'react-globe.gl'
import type { FlightRoute, GlobePoint, FlightArc } from '@/types/globe'
import { getAirport, calculateDistance, kmToMiles, estimateFlightDuration } from '@/data/airports'
import type { FlightInfo } from '@/types/flight'

interface FlightGlobeProps {
  flightInfo: FlightInfo | null
  onRouteSelect?: (route: FlightRoute) => void
  className?: string
}

export function FlightGlobe({ flightInfo, onRouteSelect, className }: FlightGlobeProps) {
  const globeRef = useRef<any>()
  const [globeReady, setGlobeReady] = useState(false)
  const [points, setPoints] = useState<GlobePoint[]>([])
  const [arcs, setArcs] = useState<FlightArc[]>([])
  const [currentRoute, setCurrentRoute] = useState<FlightRoute | null>(null)

  // Initialize globe settings
  useEffect(() => {
    if (globeRef.current && !globeReady) {
      const globe = globeRef.current
      
      // Set initial camera position - closer for dramatic welcome effect
      globe.pointOfView({
        lat: 15,
        lng: 0, 
        altitude: 1.5 // Closer for bigger appearance
      })

      // Auto-rotate
      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.3 // Slower for more elegant feel
      globe.controls().enableZoom = true
      globe.controls().enablePan = true

      setGlobeReady(true)
    }
  }, [globeReady])

  // Handle mode transitions based on flight info and email input state
  useEffect(() => {
    if (globeRef.current && globeReady) {
      if (!flightInfo) {
        // Welcome mode - closer and dramatic (positioning handled by CSS transform)
        globeRef.current.pointOfView({
          lat: 15,
          lng: 0,
          altitude: 1.5 // Close and dramatic
        }, 1500) // 1.5 second smooth transition
      } else {
        // Flight mode - zoom out for optimal route viewing with Apple-like timing
        globeRef.current.pointOfView({
          lat: 25,
          lng: 0,
          altitude: 2.8 // Zoomed out for flight routes
        }, 1500) // 1.5 second smooth Apple-like transition
      }
    }
  }, [flightInfo, globeReady])

  // Update globe when flight info changes
  useEffect(() => {
    if (flightInfo && globeReady) {
      const departureAirport = getAirport(flightInfo.departureAirport)
      const arrivalAirport = getAirport(flightInfo.arrivalAirport)

      if (departureAirport && arrivalAirport) {
        // Calculate route data
        const distance = calculateDistance(
          departureAirport.lat, departureAirport.lng,
          arrivalAirport.lat, arrivalAirport.lng
        )

        const route: FlightRoute = {
          id: `${flightInfo.flightNumber}-${Date.now()}`,
          flightInfo,
          departureAirport,
          arrivalAirport,
          distance,
          distanceMiles: kmToMiles(distance),
          estimatedDuration: estimateFlightDuration(distance),
          arcColor: '#2563eb',
          strokeWidth: 2
        }

        // Create airport points
        const newPoints: GlobePoint[] = [
          {
            lat: departureAirport.lat,
            lng: departureAirport.lng,
            size: 0.8,
            color: '#10b981', // Green for departure
            label: `${departureAirport.code} - ${departureAirport.city}`,
            airport: departureAirport
          },
          {
            lat: arrivalAirport.lat,
            lng: arrivalAirport.lng,
            size: 0.8,
            color: '#3b82f6', // Blue for arrival
            label: `${arrivalAirport.code} - ${arrivalAirport.city}`,
            airport: arrivalAirport
          }
        ]

        // Create flight arc
        const newArcs: FlightArc[] = [
          {
            startLat: departureAirport.lat,
            startLng: departureAirport.lng,
            endLat: arrivalAirport.lat,
            endLng: arrivalAirport.lng,
            color: '#2563eb',
            strokeWidth: 3,
            flightInfo
          }
        ]

        setPoints(newPoints)
        setArcs(newArcs)
        setCurrentRoute(route)

        // Auto-focus on the route with enhanced zoom behavior
        if (globeRef.current) {
          const midLat = (departureAirport.lat + arrivalAirport.lat) / 2
          const midLng = (departureAirport.lng + arrivalAirport.lng) / 2
          
          // Enhanced zoom calculation based on route distance
          let altitude
          if (distance < 1000) { // Short domestic flights
            altitude = 1.2
          } else if (distance < 5000) { // Medium distance flights
            altitude = 1.5
          } else if (distance < 10000) { // Long distance flights
            altitude = 2.0
          } else { // Intercontinental flights
            altitude = 2.5
          }

          // Smooth zoom with easing
          globeRef.current.pointOfView({
            lat: midLat,
            lng: midLng,
            altitude
          }, 3000) // 3 second smooth animation

          // Stop auto-rotation when focused on flight
          globeRef.current.controls().autoRotate = false
          
          // Re-enable auto-rotation after 10 seconds
          setTimeout(() => {
            if (globeRef.current) {
              globeRef.current.controls().autoRotate = true
              globeRef.current.controls().autoRotateSpeed = 0.2 // Slower rotation
            }
          }, 10000)
        }

        // Only notify parent component on first load, not on every update
        if (onRouteSelect && !currentRoute) {
          onRouteSelect(route)
        }
      }
    } else if (!flightInfo) {
      // Clear globe when no flight info
      setPoints([])
      setArcs([])
      setCurrentRoute(null)
    }
  }, [flightInfo, globeReady, onRouteSelect])

  // Handle point clicks
  const handlePointClick = (point: GlobePoint) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.2
      }, 1500)
    }
  }

  // Handle arc clicks
  const handleArcClick = (arc: FlightArc) => {
    if (currentRoute && onRouteSelect) {
      onRouteSelect(currentRoute)
    }
  }

  return (
    <div className={`w-full h-screen relative overflow-hidden ${className}`}>
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Large Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Small Twinkling Stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={`twinkle-${i}`}
              className="absolute rounded-full bg-blue-200 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '1px',
                height: '1px',
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 1}s`,
                opacity: Math.random() * 0.6 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Distant Galaxies */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`galaxy-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-sm animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            />
          ))}
        </div>
      </div>

      <div 
        className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          !flightInfo ? 'transform translate-y-[400px] scale-110' : 'transform translate-y-0 scale-100'
        }`}
      >
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.15}
        
        // Points (airports)
        pointsData={points}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointColor={d => d.color}
        pointRadius={d => d.size}
        pointResolution={20}
        pointsMerge={true}
        onPointClick={handlePointClick}
        pointLabel={d => `
          <div class="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/20 font-aeonik max-w-xs" style="border-radius: 16px;">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-2 h-2 rounded-full ${d.color === '#10b981' ? 'bg-green-400' : 'bg-blue-400'}" style="box-shadow: 0 0 8px ${d.color === '#10b981' ? '#10b981' : '#3b82f6'}30;"></div>
              <div class="font-bold text-white text-sm">${d.airport.code}</div>
            </div>
            <div class="text-xs text-gray-200 font-medium leading-tight">${d.airport.name}</div>
            <div class="text-xs text-gray-400 leading-tight">${d.airport.city}</div>
          </div>
        `}

        // Arcs (flight routes)
        arcsData={arcs}
        arcStartLat={d => d.startLat}
        arcStartLng={d => d.startLng}
        arcEndLat={d => d.endLat}
        arcEndLng={d => d.endLng}
        arcColor={d => d.color}
        arcStroke={d => d.strokeWidth}
        arcDashLength={0.8}
        arcDashGap={0.2}
        arcDashAnimateTime={3000}
        arcsTransitionDuration={2000}
        onArcClick={handleArcClick}
        arcLabel={d => `
          <div class="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-blue-400/30 font-aeonik max-w-xs" style="border-radius: 20px; background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95));">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center" style="backdrop-filter: blur(4px);">
                <div class="text-blue-300 text-sm">✈</div>
              </div>
              <div class="font-bold text-white text-sm">${d.flightInfo.flightNumber}</div>
            </div>
            <div class="text-xs text-gray-300 space-y-1">
              <div class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 rounded-full bg-green-400" style="box-shadow: 0 0 4px #10b98140;"></div>
                <span class="font-medium text-gray-200">${d.flightInfo.departureAirport}</span>
                <span class="text-gray-500 text-xs">→</span>
                <div class="w-1.5 h-1.5 rounded-full bg-blue-400" style="box-shadow: 0 0 4px #3b82f640;"></div>
                <span class="font-medium text-gray-200">${d.flightInfo.arrivalAirport}</span>
              </div>
              ${d.flightInfo.passengerName ? `
                <div class="flex items-center gap-1 pt-1">
                  <div class="w-1 h-1 rounded-full bg-yellow-400"></div>
                  <span class="text-gray-300">${d.flightInfo.passengerName}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `}

        // Controls
        controls={{
          enableZoom: true,
          enablePan: true,
          enableRotate: true,
          autoRotate: true,
          autoRotateSpeed: 0.5,
          minDistance: 200,
          maxDistance: 1000
        }}

        // Performance
        enablePointerInteraction={true}
        animateIn={true}
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight : 800}
        />
      </div>



      {/* Enhanced Controls info */}
      <div className="absolute bottom-4 right-4 bg-gray-900/20 backdrop-blur-md rounded-xl border border-white/20 p-4 text-white font-aeonik shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-sm">🎮</div>
          <div className="text-sm font-semibold">Navigation</div>
        </div>
        <div className="text-xs text-white/80 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-300">🖱️</span>
            <span>Drag to rotate Earth</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-300">⚡</span>
            <span>Scroll to zoom in/out</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-300">👆</span>
            <span>Click for flight details</span>
          </div>
        </div>
      </div>
    </div>
  )
}
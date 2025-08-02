import React, { useState, useEffect } from 'react'
import { Mail, Globe as GlobeIcon, RotateCcw, Sparkles, ChevronLeft } from 'lucide-react'
import { FlightGlobe } from './FlightGlobe'
import { FlightInfoSheet } from './FlightInfoSheet'
import { FlightHistory } from './FlightHistory'
import { EmailInput } from './EmailInput'
import { Button } from '@/components/ui/Button'
import { useFlightHistory } from '@/hooks/useFlightHistory'
import { getAirport, calculateDistance, kmToMiles, estimateFlightDuration } from '@/data/airports'
import type { FlightRoute } from '@/types/globe'

export function GlobeApp() {
  const {
    flights,
    currentFlight,
    isLoading,
    error,
    emailContent,
    setEmailContent,
    parseEmailContent,
    useSampleEmail,
    runDemo,
    selectFlight,
    reset,
    clearHistory,
  } = useFlightHistory()

  const [currentRoute, setCurrentRoute] = useState<FlightRoute | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(!currentFlight)
  const [showFlightHistory, setShowFlightHistory] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Create FlightRoute from FlightInfo
  const createFlightRoute = (flightInfo: FlightInfo): FlightRoute | null => {
    try {
      const departureAirport = getAirport(flightInfo.departureAirport)
      const arrivalAirport = getAirport(flightInfo.arrivalAirport)

      if (!departureAirport || !arrivalAirport) {
        console.warn('Could not find airports for route')
        return null
      }

      const distance = calculateDistance(
        departureAirport.lat, departureAirport.lng,
        arrivalAirport.lat, arrivalAirport.lng
      )

      return {
        id: `${flightInfo.flightNumber}-${flightInfo.parsedAt}`,
        flightInfo,
        departureAirport,
        arrivalAirport,
        distance,
        distanceMiles: kmToMiles(distance),
        estimatedDuration: estimateFlightDuration(distance),
        arcColor: '#2563eb',
        strokeWidth: 2
      }
    } catch (error) {
      console.error('Error creating flight route:', error)
      return null
    }
  }

  // Effect to create route when current flight changes
  useEffect(() => {
    if (currentFlight) {
      const route = createFlightRoute(currentFlight)
      if (route) {
        setCurrentRoute(route)
      }
    } else {
      setCurrentRoute(null)
    }
  }, [currentFlight])

  // Handle route selection from globe
  const handleRouteSelect = (route: FlightRoute) => {
    setCurrentRoute(route)
    setIsSheetOpen(true)
  }

  // Handle sheet close with proper state cleanup
  const handleSheetClose = () => {
    setIsSheetOpen(false)
    // Don't clear currentRoute so we keep the stats overlay
  }

  // Handle successful email parsing
  const handleEmailParse = () => {
    parseEmailContent()
    if (!isLoading && !error) {
      setShowEmailInput(false)
    }
  }

  // Handle showing email input with smooth Apple-like globe transition
  const handleShowEmailInput = () => {
    setIsTransitioning(true)
    
    // Start fade out transition
    setTimeout(() => {
      setShowEmailInput(true)
      setIsTransitioning(false)
    }, 300) // Half the transition duration for smooth handoff
  }

  // Handle flight selection from history
  const handleFlightHistorySelect = (flightId: string) => {
    selectFlight(flightId)
    const selectedFlight = flights.find(f => f.id === flightId)
    if (selectedFlight) {
      const route = createFlightRoute(selectedFlight)
      if (route) {
        setCurrentRoute(route)
        setIsSheetOpen(true)
      }
    }
  }

  // Handle reset
  const handleReset = () => {
    reset()
    setCurrentRoute(null)
    setIsSheetOpen(false)
    setShowEmailInput(true)
    setIsTransitioning(false)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Globe Background */}
      <FlightGlobe
        flightInfo={currentFlight}
        onRouteSelect={handleRouteSelect}
        className="absolute inset-0"
      />

      {/* Streamlined Top Navigation */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <div className="glass-blue-nav rounded-2xl px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-aeonik font-bold text-white text-lg">Flight Assistant</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEmailInput(!showEmailInput)}
                variant="ghost"
                size="sm"
                className="glass-blue-button font-aeonik rounded-lg"
              >
                <Mail className="mr-2 h-4 w-4" />
                {showEmailInput ? 'Hide' : 'Add Flight'}
              </Button>
              
              {flights.length > 0 && (
                <Button
                  onClick={() => setShowFlightHistory(!showFlightHistory)}
                  variant="ghost"
                  size="sm"
                  className="glass-blue-button font-aeonik rounded-lg"
                >
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  {showFlightHistory ? 'Hide' : 'History'}
                </Button>
              )}
              
              {currentFlight && (
                <Button
                  onClick={() => setIsSheetOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="glass-blue-button font-aeonik rounded-lg"
                >
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  Details
                </Button>
              )}

              <Button
                onClick={async () => {
                  await runDemo()
                  setShowEmailInput(false)
                }}
                variant="ghost"
                size="sm"
                className="glass-blue-button font-aeonik rounded-lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Demo
              </Button>

              {currentFlight && (
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="glass-blue-button font-aeonik rounded-lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Email Input Panel - Dark Matte Theme */}
      <div className={`fixed bottom-6 left-6 w-96 z-30 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        showEmailInput 
          ? 'transform translate-y-0 opacity-100 scale-100' 
          : 'transform translate-y-full opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="glass-dark-panel rounded-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <h3 className="text-lg font-aeonik font-semibold text-gray-100">Add Flight</h3>
              </div>
              <button
                onClick={() => setShowEmailInput(false)}
                className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            
            <EmailInput
              emailContent={emailContent}
              onEmailContentChange={setEmailContent}
              onParseEmail={handleEmailParse}
              onUseSampleEmail={() => {
                useSampleEmail()
                // Auto-parse after setting sample email
                setTimeout(() => {
                  parseEmailContent()
                  setShowEmailInput(false)
                }, 100)
              }}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Bottom Left Flight History Panel */}
      <div className={`fixed bottom-6 left-6 w-96 z-30 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        showFlightHistory 
          ? 'transform translate-y-0 opacity-100 scale-100' 
          : 'transform translate-y-full opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="glass-dark-panel rounded-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <h3 className="text-lg font-aeonik font-semibold text-gray-100">Flight History</h3>
              </div>
              <button
                onClick={() => setShowFlightHistory(false)}
                className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            
            <FlightHistory
              flights={flights}
              currentFlight={currentFlight}
              onSelectFlight={handleFlightHistorySelect}
              onClearHistory={clearHistory}
            />
          </div>
        </div>
      </div>



      {/* Clean Apple-like Welcome Message */}
      {!currentFlight && !showEmailInput && (
        <div className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-700 ease-out ${
          isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}>
          <div className={`text-center text-white max-w-md mx-4 transform transition-all duration-500 ease-out ${
            isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            <div className="mb-12">
              <h1 className="text-5xl font-aeonik font-semibold mb-4 text-white drop-shadow-xl">
                Flight Assistant
              </h1>
              <p className="text-xl text-white/70 font-aeonik font-medium leading-relaxed drop-shadow-lg">
                Track flights across the beautiful Earth
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleShowEmailInput}
                size="lg"
                className="w-full glass-blue-button font-aeonik font-medium rounded-xl py-4 hover:scale-105 transform"
              >
                Add Flight
              </Button>
              
              <Button
                onClick={() => runDemo()}
                variant="ghost"
                size="lg"
                className="w-full text-white bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-white/50 font-aeonik font-medium rounded-xl py-4 transition-all duration-200 hover:scale-105"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flight Info Sheet */}
      <FlightInfoSheet
        route={currentRoute}
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
      />
    </div>
  )
}
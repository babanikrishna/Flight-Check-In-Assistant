import React, { useState, useRef, useEffect } from 'react'
import { X, Plane, Clock, MapPin, User, Navigation, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FlightRoute } from '@/types/globe'
import { formatDate, formatTime, getAirlineName, getAirlineImage } from '@/utils'
import { generateGoogleCalendarLink, downloadIcsFile } from '@/utils/calendar'

interface FlightInfoSheetProps {
  route: FlightRoute | null
  isOpen: boolean
  onClose: () => void
}

export function FlightInfoSheet({ route, isOpen, onClose }: FlightInfoSheetProps) {
  if (!route || !isOpen) return null

  const { flightInfo, departureAirport, arrivalAirport, distance, distanceMiles, estimatedDuration } = route
  
  // Scroll state for header minimization
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleGoogleCalendar = () => {
    const link = generateGoogleCalendarLink(flightInfo)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadIcs = () => {
    downloadIcsFile(flightInfo)
  }

  // Simplified close handler
  const handleClose = () => {
    onClose()
  }

  // Handle backdrop click with proper event handling
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not child elements
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle scroll for header minimization
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop
        setIsScrolled(scrollTop > 50) // Minimize after 50px scroll
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={handleBackdropClick}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up flex justify-center">
        <div className="rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden bg-white/15 backdrop-blur-2xl border border-white/30 w-full max-w-4xl mx-4">
            {/* Header */}
            <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white relative transition-all duration-300 ${
              isScrolled ? 'py-3 px-6' : 'p-6'
            }`}>
              {/* Primary close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-50 cursor-pointer"
                aria-label="Close flight details"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
              

              
              <div className={`flex items-center gap-3 transition-all duration-300 ${
                isScrolled ? 'mb-2' : 'mb-4'
              }`}>
                <div className={`bg-white/20 rounded-xl transition-all duration-300 ${
                  isScrolled ? 'p-2' : 'p-3'
                }`}>
                  <Plane className={`transition-all duration-300 ${
                    isScrolled ? 'h-4 w-4' : 'h-6 w-6'
                  }`} />
                </div>
                <div>
                  <h2 className={`font-aeonik font-bold transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-2xl'
                  }`}>Flight {flightInfo.flightNumber}</h2>
                  <p className={`text-primary-100 font-aeonik transition-all duration-300 ${
                    isScrolled ? 'text-xs' : 'text-base'
                  }`}>{getAirlineName(flightInfo.airline)}</p>
                </div>
              </div>

              {/* Airline Image - Between airline name and route */}
              <div className={`flex justify-center transition-all duration-300 ${
                isScrolled ? 'mb-3' : 'mb-6'
              }`}>
                <img 
                  src={getAirlineImage(flightInfo.airline)} 
                  alt={`${getAirlineName(flightInfo.airline)} Logo`}
                  className={`w-auto object-contain transition-all duration-300 ${
                    isScrolled ? 'h-20' : 'h-48'
                  }`}
                  onError={(e) => {
                    // Fallback to BA.png if airline-specific image fails
                    if (e.currentTarget.src.includes('BA.png')) return
                    e.currentTarget.src = "/images/airlines/BA.png"
                  }}
                />
              </div>

              {/* Route Summary */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className={`font-aeonik font-bold transition-all duration-300 ${
                    isScrolled ? 'text-xl' : 'text-3xl'
                  }`}>{departureAirport.code}</div>
                  <div className={`text-primary-100 font-aeonik transition-all duration-300 ${
                    isScrolled ? 'text-xs' : 'text-sm'
                  }`}>{departureAirport.city}</div>
                </div>
                
                <div className={`flex-1 transition-all duration-300 ${
                  isScrolled ? 'px-2' : 'px-4'
                }`}>
                  <div className="relative">
                    <div className="h-0.5 bg-primary-300"></div>
                    <Plane className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white rounded-full transition-all duration-300 ${
                      isScrolled ? 'h-3 w-3 p-0.5' : 'h-4 w-4 p-1'
                    }`} />
                  </div>
                  <div className={`text-center transition-all duration-300 ${
                    isScrolled ? 'mt-1' : 'mt-2'
                  }`}>
                    <div className={`font-aeonik font-medium transition-all duration-300 ${
                      isScrolled ? 'text-xs' : 'text-sm'
                    }`}>{Math.round(distanceMiles).toLocaleString()} mi</div>
                    <div className={`text-primary-100 font-aeonik transition-all duration-300 ${
                      isScrolled ? 'text-xs hidden' : 'text-xs'
                    }`}>{estimatedDuration}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`font-aeonik font-bold transition-all duration-300 ${
                    isScrolled ? 'text-xl' : 'text-3xl'
                  }`}>{arrivalAirport.code}</div>
                  <div className={`text-primary-100 font-aeonik transition-all duration-300 ${
                    isScrolled ? 'text-xs' : 'text-sm'
                  }`}>{arrivalAirport.city}</div>
                </div>
              </div>
            </div>



            {/* Content */}
            <div 
              ref={scrollContainerRef}
              className="px-6 py-8 max-h-[60vh] overflow-y-auto"
            >
              {/* Flight Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
                {/* Passenger Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-aeonik font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-300" />
                    Passenger Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-aeonik text-gray-300">Passenger Name</div>
                      <div className="text-lg font-aeonik font-semibold text-white">{flightInfo.passengerName}</div>
                    </div>
                    {flightInfo.confirmationCode && (
                      <div>
                        <div className="text-sm font-aeonik text-gray-300">Confirmation Code</div>
                        <div className="text-lg font-aeonik font-semibold text-white">{flightInfo.confirmationCode}</div>
                      </div>
                    )}
                    {flightInfo.seat && (
                      <div>
                        <div className="text-sm font-aeonik text-gray-300">Seat</div>
                        <div className="text-lg font-aeonik font-semibold text-white">{flightInfo.seat}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Flight Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-aeonik font-semibold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-300" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    {flightInfo.departureDate && (
                      <div>
                        <div className="text-sm font-aeonik text-gray-300">Departure</div>
                        <div className="text-lg font-aeonik font-semibold text-white">
                          {formatDate(flightInfo.departureDate)}
                          {flightInfo.departureTime && (
                            <span className="ml-2 text-blue-300">{formatTime(flightInfo.departureTime)}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {flightInfo.arrivalTime && (
                      <div>
                        <div className="text-sm font-aeonik text-gray-300">Arrival</div>
                        <div className="text-lg font-aeonik font-semibold text-white">
                          {flightInfo.arrivalDate ? formatDate(flightInfo.arrivalDate) : formatDate(flightInfo.departureDate)}
                          <span className="ml-2 text-blue-300">{formatTime(flightInfo.arrivalTime)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Airport Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
                <div className="space-y-3">
                  <h4 className="font-aeonik font-semibold text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Departure Airport
                  </h4>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-5">
                    <div className="font-aeonik font-semibold text-white text-lg">{departureAirport.name}</div>
                    <div className="text-sm font-aeonik text-gray-200 mt-1">{departureAirport.city}, {departureAirport.country}</div>
                    <div className="text-xs font-aeonik text-gray-300 mt-2">Timezone: {departureAirport.timezone}</div>
                    {flightInfo.gate && (
                      <div className="mt-3 space-y-1">
                        {flightInfo.gate && <div className="text-sm font-aeonik"><span className="text-gray-300">Gate:</span> <span className="font-semibold text-white">{flightInfo.gate}</span></div>}
                        {flightInfo.terminal && <div className="text-sm font-aeonik"><span className="text-gray-300">Terminal:</span> <span className="font-semibold text-white">{flightInfo.terminal}</span></div>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-aeonik font-semibold text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Arrival Airport
                  </h4>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-5">
                    <div className="font-aeonik font-semibold text-white text-lg">{arrivalAirport.name}</div>
                    <div className="text-sm font-aeonik text-gray-200 mt-1">{arrivalAirport.city}, {arrivalAirport.country}</div>
                    <div className="text-xs font-aeonik text-gray-300 mt-2">Timezone: {arrivalAirport.timezone}</div>
                  </div>
                </div>
              </div>



              {/* Route Stats */}
              <div className="bg-gradient-to-r from-blue-200/20 to-indigo-200/20 backdrop-blur-sm border border-blue-300/20 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
                <h4 className="font-aeonik font-semibold text-white mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-300" />
                  Route Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-aeonik font-bold text-blue-300">{Math.round(distance).toLocaleString()}</div>
                    <div className="text-sm font-aeonik text-gray-200">Kilometers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-aeonik font-bold text-blue-300">{Math.round(distanceMiles).toLocaleString()}</div>
                    <div className="text-sm font-aeonik text-gray-200">Miles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-aeonik font-bold text-blue-300">{estimatedDuration}</div>
                    <div className="text-sm font-aeonik text-gray-200">Est. Duration</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 max-w-2xl mx-auto pb-8">
                <h4 className="font-aeonik font-semibold text-white">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={handleGoogleCalendar} variant="primary" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                  <Button onClick={handleDownloadIcs} variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download .ics
                  </Button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}
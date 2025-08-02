import React from 'react'
import { Plane, Calendar, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FlightInfo } from '@/types/flight'
import { getAirlineName, getAirlineColors, formatDate, formatTime } from '@/utils'

interface FlightHistoryProps {
  flights: FlightInfo[]
  currentFlight: FlightInfo | null
  onSelectFlight: (flightId: string) => void
  onClearHistory: () => void
}

export function FlightHistory({ flights, currentFlight, onSelectFlight, onClearHistory }: FlightHistoryProps) {
  if (flights.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={onClearHistory}
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-700/50 px-2 py-1 text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
          {flights.map((flight) => {
            const airlineColors = getAirlineColors(flight.airline)
            const isSelected = currentFlight?.id === flight.id
            
            return (
              <button
                key={flight.id}
                onClick={() => onSelectFlight(flight.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                  isSelected 
                    ? 'bg-gray-600/40 border-gray-500/60 shadow-lg' 
                    : 'bg-gray-700/20 border-gray-600/30 hover:bg-gray-600/30 hover:border-gray-500/40'
                }`}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${airlineColors.primary}20, ${airlineColors.secondary}20)`
                    : undefined
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${airlineColors.primary}40, ${airlineColors.secondary}40)`,
                      border: `1px solid ${airlineColors.primary}40`
                    }}
                  >
                    <Plane className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-aeonik font-bold text-sm"
                        style={{ color: isSelected ? airlineColors.primary : '#f3f4f6' }}
                      >
                        {flight.flightNumber}
                      </span>
                      <span className="text-xs text-white/60 font-aeonik">
                        {getAirlineName(flight.airline)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-white/80 font-aeonik">
                      <span>{flight.departureAirport}</span>
                      <span>→</span>
                      <span>{flight.arrivalAirport}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-white/60" />
                      <span className="text-xs text-white/60 font-aeonik">
                        {formatDate(flight.departureDate)}
                        {flight.departureTime && (
                          <span className="ml-1">
                            {formatTime(flight.departureTime)}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-3 w-3 text-white/60" />
                      <span className="text-xs text-white/60 font-aeonik truncate">
                        {flight.passengerName}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
      </div>
        
      <div className="text-xs text-gray-400 font-aeonik mt-3 text-center">
        {flights.length} flight{flights.length > 1 ? 's' : ''} • Resets on refresh
      </div>
    </div>
  )
}
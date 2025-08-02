import React from 'react'
import { Plane, Clock, MapPin, User, Hash, Navigation, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { FlightInfo } from '@/types/flight'
import { formatDate, formatTime, getAirlineName, getAirportName } from '@/utils'

interface FlightDetailsProps {
  flightInfo: FlightInfo
}

export function FlightDetails({ flightInfo }: FlightDetailsProps) {
  return (
    <div className="animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-aeonik">
              <Plane className="h-5 w-5 text-primary-600" />
              Flight Information
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Flight Number & Airline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                <Hash className="h-4 w-4" />
                Flight Number
              </div>
              <div className="text-lg font-aeonik font-semibold text-gray-900">
                {flightInfo.flightNumber}
              </div>
              <div className="text-sm font-aeonik text-gray-600">
                {getAirlineName(flightInfo.airline)}
              </div>
            </div>

            {/* Passenger */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                <User className="h-4 w-4" />
                Passenger
              </div>
              <div className="text-lg font-aeonik font-semibold text-gray-900">
                {flightInfo.passengerName}
              </div>
            </div>

            {/* Confirmation Code */}
            {flightInfo.confirmationCode && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                  <Hash className="h-4 w-4" />
                  Confirmation Code
                </div>
                <div className="text-lg font-aeonik font-semibold text-gray-900">
                  {flightInfo.confirmationCode}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      <Card className="mb-6">
        <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-aeonik">
              <MapPin className="h-5 w-5 text-primary-600" />
              Route & Schedule
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Departure */}
            <div className="space-y-4">
              <h4 className="font-aeonik font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Departure
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-aeonik font-bold text-gray-900">
                    {flightInfo.departureAirport}
                  </div>
                  <div className="text-sm font-aeonik text-gray-600">
                    {getAirportName(flightInfo.departureAirport)}
                  </div>
                </div>
                {flightInfo.departureDate && (
                  <div className="flex items-center gap-2 font-aeonik text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(flightInfo.departureDate)}</span>
                    {flightInfo.departureTime && (
                      <span className="font-semibold">
                        at {formatTime(flightInfo.departureTime)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Arrival */}
            <div className="space-y-4">
              <h4 className="font-aeonik font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Arrival
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-aeonik font-bold text-gray-900">
                    {flightInfo.arrivalAirport}
                  </div>
                  <div className="text-sm font-aeonik text-gray-600">
                    {getAirportName(flightInfo.arrivalAirport)}
                  </div>
                </div>
                {flightInfo.arrivalTime && (
                  <div className="flex items-center gap-2 font-aeonik text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>
                      {flightInfo.arrivalDate ? formatDate(flightInfo.arrivalDate) : formatDate(flightInfo.departureDate)}
                    </span>
                    <span className="font-semibold">
                      at {formatTime(flightInfo.arrivalTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      {(flightInfo.gate || flightInfo.terminal || flightInfo.seat) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-aeonik">
              <Navigation className="h-5 w-5 text-primary-600" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flightInfo.gate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                    <Navigation className="h-4 w-4" />
                    Gate
                  </div>
                  <div className="text-lg font-aeonik font-semibold text-gray-900">
                    {flightInfo.gate}
                  </div>
                </div>
              )}

              {flightInfo.terminal && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                    <Building className="h-4 w-4" />
                    Terminal
                  </div>
                  <div className="text-lg font-aeonik font-semibold text-gray-900">
                    {flightInfo.terminal}
                  </div>
                </div>
              )}

              {flightInfo.seat && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-aeonik text-gray-500">
                    <User className="h-4 w-4" />
                    Seat
                  </div>
                  <div className="text-lg font-aeonik font-semibold text-gray-900">
                    {flightInfo.seat}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
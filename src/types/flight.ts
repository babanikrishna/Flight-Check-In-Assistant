// Flight data types - Similar to SwiftUI structs
export interface FlightInfo {
  id: string // Unique identifier for each flight
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureDate: string
  departureTime: string
  arrivalDate?: string
  arrivalTime?: string
  passengerName: string
  confirmationCode?: string
  gate?: string
  terminal?: string
  seat?: string
  parsedAt: number // Timestamp when parsed
}

export interface ParseResult {
  success: boolean
  data?: Omit<FlightInfo, 'id' | 'parsedAt'>
  error?: string
}

export interface CalendarEvent {
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  location: string
}
import type { FlightInfo } from './flight'
import type { Airport } from '@/data/airports'

export interface FlightRoute {
  id: string
  flightInfo: FlightInfo
  departureAirport: Airport
  arrivalAirport: Airport
  distance: number
  distanceMiles: number
  estimatedDuration: string
  arcColor: string
  strokeWidth: number
}

export interface GlobePoint {
  lat: number
  lng: number
  size: number
  color: string
  label: string
  airport: Airport
}

export interface FlightArc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color: string
  strokeWidth: number
  flightInfo: FlightInfo
}
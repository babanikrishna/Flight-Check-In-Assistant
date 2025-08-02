// Airport coordinates database for globe visualization
export interface Airport {
  code: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  timezone: string
}

export const AIRPORTS: Record<string, Airport> = {
  // Major US Airports
  'LAX': { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', lat: 33.9425, lng: -118.4081, timezone: 'America/Los_Angeles' },
  'JFK': { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781, timezone: 'America/New_York' },
  'LGA': { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA', lat: 40.7769, lng: -73.8740, timezone: 'America/New_York' },
  'EWR': { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', lat: 40.6895, lng: -74.1745, timezone: 'America/New_York' },
  'ORD': { code: 'ORD', name: 'Chicago O\'Hare International', city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073, timezone: 'America/Chicago' },
  'DFW': { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', lat: 32.8998, lng: -97.0403, timezone: 'America/Chicago' },
  'DEN': { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', lat: 39.8561, lng: -104.6737, timezone: 'America/Denver' },
  'ATL': { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', lat: 33.6407, lng: -84.4277, timezone: 'America/New_York' },
  'MIA': { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.7959, lng: -80.2870, timezone: 'America/New_York' },
  'SEA': { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088, timezone: 'America/Los_Angeles' },
  'SFO': { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.3790, timezone: 'America/Los_Angeles' },
  'BOS': { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', lat: 42.3656, lng: -71.0096, timezone: 'America/New_York' },
  'LAS': { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA', lat: 36.0840, lng: -115.1537, timezone: 'America/Los_Angeles' },
  'PHX': { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, timezone: 'America/Phoenix' },
  'IAH': { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', lat: 29.9902, lng: -95.3368, timezone: 'America/Chicago' },
  'MCO': { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA', lat: 28.4312, lng: -81.3081, timezone: 'America/New_York' },
  'CLT': { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'USA', lat: 35.2144, lng: -80.9473, timezone: 'America/New_York' },
  'MSP': { code: 'MSP', name: 'Minneapolis-St. Paul International', city: 'Minneapolis', country: 'USA', lat: 44.8848, lng: -93.2223, timezone: 'America/Chicago' },
  'DTW': { code: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'USA', lat: 42.2162, lng: -83.3554, timezone: 'America/New_York' },
  'SLC': { code: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', country: 'USA', lat: 40.7899, lng: -111.9791, timezone: 'America/Denver' },

  // International Airports
  'LHR': { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543, timezone: 'Europe/London' },
  'CDG': { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479, timezone: 'Europe/Paris' },
  'FRA': { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622, timezone: 'Europe/Berlin' },
  'AMS': { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683, timezone: 'Europe/Amsterdam' },
  'ZUR': { code: 'ZUR', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', lat: 47.4647, lng: 8.5492, timezone: 'Europe/Zurich' },
  'ICN': { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', lat: 37.4602, lng: 126.4407, timezone: 'Asia/Seoul' },
  'NRT': { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', lat: 35.7653, lng: 140.3856, timezone: 'Asia/Tokyo' },
  'HND': { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798, timezone: 'Asia/Tokyo' },
  'SIN': { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915, timezone: 'Asia/Singapore' },
  'DXB': { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657, timezone: 'Asia/Dubai' },
  'SYD': { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9399, lng: 151.1753, timezone: 'Australia/Sydney' },
  'YYZ': { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248, timezone: 'America/Toronto' },
  'YVR': { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', lat: 49.1967, lng: -123.1815, timezone: 'America/Vancouver' },
  'GRU': { code: 'GRU', name: 'São Paulo–Guarulhos International', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lng: -46.4731, timezone: 'America/Sao_Paulo' },
  'MEX': { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', lat: 19.4363, lng: -99.0721, timezone: 'America/Mexico_City' },
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Convert distance to miles
export function kmToMiles(km: number): number {
  return km * 0.621371
}

// Get airport by code
export function getAirport(code: string): Airport | undefined {
  return AIRPORTS[code.toUpperCase()]
}

// Calculate flight duration estimate (rough calculation)
export function estimateFlightDuration(distance: number): string {
  // Average commercial aircraft speed: ~800 km/h
  const avgSpeed = 800
  const hours = distance / avgSpeed
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}
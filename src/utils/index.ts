import { clsx, type ClassValue } from 'clsx'

// Utility function for conditional classNames (similar to SwiftUI modifiers)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format date for display
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Format time for display
export function formatTime(timeString: string): string {
  if (!timeString) return ''
  
  try {
    // Handle various time formats
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
    const match = timeString.match(timeRegex)
    
    if (match) {
      const hours = parseInt(match[1])
      const minutes = match[2]
      const ampm = match[3]
      
      if (ampm) {
        return `${hours}:${minutes} ${ampm.toUpperCase()}`
      } else {
        // Convert 24h to 12h format
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        const period = hours >= 12 ? 'PM' : 'AM'
        return `${hour12}:${minutes} ${period}`
      }
    }
    
    return timeString
  } catch {
    return timeString
  }
}

// Generate airline name from code
export function getAirlineName(code: string): string {
  const airlines: Record<string, string> = {
    'AA': 'American Airlines',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
    'WN': 'Southwest Airlines',
    'AS': 'Alaska Airlines',
    'B6': 'JetBlue Airways',
    'NK': 'Spirit Airlines',
    'F9': 'Frontier Airlines',
    'G4': 'Allegiant Air',
    'SY': 'Sun Country Airlines',
    // International
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'NH': 'ANA',
  }
  
  return airlines[code.toUpperCase()] || code
}

// Get airline brand colors
export function getAirlineColors(code: string): { primary: string; secondary: string; gradient: string } {
  const colors: Record<string, { primary: string; secondary: string; gradient: string }> = {
    'AA': { 
      primary: '#C8102E', 
      secondary: '#004B87', 
      gradient: 'from-red-600 to-blue-800' 
    }, // American Airlines - Red & Blue
    'UA': { 
      primary: '#003366', 
      secondary: '#0074D9', 
      gradient: 'from-blue-900 to-blue-600' 
    }, // United Airlines - Navy Blue
    'DL': { 
      primary: '#003366', 
      secondary: '#C8102E', 
      gradient: 'from-blue-900 to-red-600' 
    }, // Delta Air Lines - Navy & Red
    'WN': { 
      primary: '#F9844A', 
      secondary: '#304CB2', 
      gradient: 'from-orange-400 to-blue-600' 
    }, // Southwest Airlines - Orange & Blue
    'AS': { 
      primary: '#005F69', 
      secondary: '#1E88E5', 
      gradient: 'from-teal-700 to-blue-500' 
    }, // Alaska Airlines - Teal
    'B6': { 
      primary: '#0066CC', 
      secondary: '#FF6600', 
      gradient: 'from-blue-600 to-orange-500' 
    }, // JetBlue Airways - Blue & Orange
    'NK': { 
      primary: '#FFD100', 
      secondary: '#000000', 
      gradient: 'from-yellow-400 to-gray-800' 
    }, // Spirit Airlines - Yellow & Black
    'F9': { 
      primary: '#4A90A4', 
      secondary: '#00A859', 
      gradient: 'from-blue-500 to-green-500' 
    }, // Frontier Airlines - Blue & Green
    'G4': { 
      primary: '#005DAA', 
      secondary: '#FF6A00', 
      gradient: 'from-blue-600 to-orange-500' 
    }, // Allegiant Air - Blue & Orange
    'SY': { 
      primary: '#003399', 
      secondary: '#FFD100', 
      gradient: 'from-blue-700 to-yellow-400' 
    }, // Sun Country Airlines - Blue & Yellow
    // International Airlines
    'BA': { 
      primary: '#1E3A8A', 
      secondary: '#DC2626', 
      gradient: 'from-blue-800 to-red-600' 
    }, // British Airways - Blue & Red
    'LH': { 
      primary: '#F9D71C', 
      secondary: '#003366', 
      gradient: 'from-yellow-400 to-blue-900' 
    }, // Lufthansa - Yellow & Blue
    'AF': { 
      primary: '#002395', 
      secondary: '#CE1126', 
      gradient: 'from-blue-800 to-red-600' 
    }, // Air France - Blue & Red
    'KL': { 
      primary: '#0066CC', 
      secondary: '#0099FF', 
      gradient: 'from-blue-600 to-blue-400' 
    }, // KLM - Blue
    'EK': { 
      primary: '#C8102E', 
      secondary: '#FFD700', 
      gradient: 'from-red-600 to-yellow-400' 
    }, // Emirates - Red & Gold
    'QR': { 
      primary: '#5D0F47', 
      secondary: '#8B1538', 
      gradient: 'from-purple-900 to-red-800' 
    }, // Qatar Airways - Burgundy
    'SQ': { 
      primary: '#003366', 
      secondary: '#FFD700', 
      gradient: 'from-blue-900 to-yellow-400' 
    }, // Singapore Airlines - Blue & Gold
    'CX': { 
      primary: '#00565B', 
      secondary: '#1BA1A8', 
      gradient: 'from-teal-800 to-teal-500' 
    }, // Cathay Pacific - Teal
    'JL': { 
      primary: '#DC143C', 
      secondary: '#000080', 
      gradient: 'from-red-600 to-blue-800' 
    }, // Japan Airlines - Red & Blue
    'NH': { 
      primary: '#1F4E79', 
      secondary: '#0078D4', 
      gradient: 'from-blue-800 to-blue-500' 
    }, // ANA - Blue
  }
  
  // Default blue theme for unknown airlines
  return colors[code.toUpperCase()] || {
    primary: '#2563eb',
    secondary: '#3b82f6',
    gradient: 'from-blue-600 to-blue-500'
  }
}

// Get airport name from code
export function getAirportName(code: string): string {
  const airports: Record<string, string> = {
    'LAX': 'Los Angeles International',
    'JFK': 'John F. Kennedy International',
    'LGA': 'LaGuardia',
    'EWR': 'Newark Liberty International',
    'ORD': 'Chicago O\'Hare International',
    'MDW': 'Chicago Midway International',
    'DFW': 'Dallas/Fort Worth International',
    'DEN': 'Denver International',
    'PHX': 'Phoenix Sky Harbor International',
    'LAS': 'McCarran International',
    'SEA': 'Seattle-Tacoma International',
    'SFO': 'San Francisco International',
    'SJC': 'San Jose International',
    'BOS': 'Logan International',
    'ATL': 'Hartsfield-Jackson Atlanta International',
    'MIA': 'Miami International',
    'FLL': 'Fort Lauderdale-Hollywood International',
    'MCO': 'Orlando International',
    'CLT': 'Charlotte Douglas International',
    'IAH': 'George Bush Intercontinental',
    'HOU': 'William P. Hobby',
    'MSP': 'Minneapolis-St. Paul International',
    'DTW': 'Detroit Metropolitan Wayne County',
    'BWI': 'Baltimore/Washington International',
    'DCA': 'Ronald Reagan Washington National',
    'IAD': 'Washington Dulles International',
    'PHL': 'Philadelphia International',
    'SLC': 'Salt Lake City International',
    'PDX': 'Portland International',
    'SAN': 'San Diego International',
    'TPA': 'Tampa International',
    'STL': 'Lambert-St. Louis International',
    'BNA': 'Nashville International',
    'AUS': 'Austin-Bergstrom International',
    'RDU': 'Raleigh-Durham International',
    'IND': 'Indianapolis International',
    'MCI': 'Kansas City International',
    'CLE': 'Cleveland Hopkins International',
    'PIT': 'Pittsburgh International',
    'CMH': 'John Glenn Columbus International',
    'JAX': 'Jacksonville International',
    'RSW': 'Southwest Florida International',
    'MSY': 'Louis Armstrong New Orleans International',
    'MEM': 'Memphis International',
    'OAK': 'Oakland International',
    'SMF': 'Sacramento International',
    'RNO': 'Reno-Tahoe International',
    'BOI': 'Boise Airport',
    'ABQ': 'Albuquerque International Sunport',
    'TUS': 'Tucson International',
    'ELP': 'El Paso International',
    'SAT': 'San Antonio International',
    'OKC': 'Will Rogers World',
    'TUL': 'Tulsa International',
    'LIT': 'Bill and Hillary Clinton National',
    'XNA': 'Northwest Arkansas Regional',
    'GRR': 'Gerald R. Ford International',
    'FWA': 'Fort Wayne International',
    'SBN': 'South Bend International',
    'LEX': 'Blue Grass',
    'SDF': 'Louisville International',
    'CVG': 'Cincinnati/Northern Kentucky International',
    'DAY': 'Dayton International',
    'CAK': 'Akron-Canton',
    'TOL': 'Toledo Express',
    'GRB': 'Green Bay-Austin Straubel International',
    'MKE': 'Milwaukee Mitchell International',
    'MSN': 'Dane County Regional',
    'DSM': 'Des Moines International',
    'CID': 'Cedar Rapids Eastern Iowa',
    'SUX': 'Sioux Gateway',
    'FSD': 'Sioux Falls Regional',
    'MOT': 'Minot International',
    'FAR': 'Hector International',
    'GFK': 'Grand Forks International',
    'BIS': 'Bismarck Municipal',
    'RAP': 'Rapid City Regional',
    'CYS': 'Cheyenne Regional',
    'COD': 'Yellowstone Regional',
    'BZN': 'Bozeman Yellowstone International',
    'MSO': 'Missoula Montana',
    'GPI': 'Glacier Park International',
    'HLN': 'Helena Regional',
    'BTM': 'Bert Mooney',
    'BIL': 'Billings Logan International',
  }
  
  return airports[code.toUpperCase()] || code
}

/**
 * Get airline image path
 * @param airlineCode - IATA airline code (e.g., 'BA', 'AA', 'DL')
 * @returns Image path for the airline, defaults to BA.png
 */
export function getAirlineImage(airlineCode: string): string {
  // For now, we only have BA.png, so return it as default
  // Later, you can add more airlines: UA.png, AA.png, DL.png, etc.
  const availableImages = ['BA']
  
  if (availableImages.includes(airlineCode.toUpperCase())) {
    return `/images/airlines/${airlineCode.toUpperCase()}.png`
  }
  
  // Default to BA.png
  return '/images/airlines/BA.png'
}
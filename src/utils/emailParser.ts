import type { FlightInfo, ParseResult } from '@/types/flight'

// Regex patterns for extracting flight information
const PATTERNS = {
  flightNumber: /(?:flight|flt)\s*[#:]?\s*([A-Z]{2,3}\s*\d{1,4})/gi,
  confirmationCode: /(?:confirmation|booking|reference)\s*[#:]?\s*([A-Z0-9]{6,8})/gi,
  passengerName: /(?:dear|passenger|name)\s*[:]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
  departureAirport: /(?:from|departure)[\s:]*([A-Z]{3})(?:\s|$|\(|,)/gi,
  arrivalAirport: /(?:to|arrival)[\s:]*([A-Z]{3})(?:\s|$|\(|,)/gi,
  date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
  time: /(\d{1,2}:\d{2}\s*(?:AM|PM)?)/gi,
  gate: /(?:gate)\s*[:]?\s*([A-Z]?\d{1,3}[A-Z]?)/gi,
  terminal: /(?:terminal)\s*[:]?\s*(\d+|[A-Z])/gi,
  seat: /(?:seat)\s*[:]?\s*(\d{1,3}[A-Z])/gi,
}

// Sample emails for testing different airlines
const SAMPLE_EMAILS = [
  {
    airline: 'American Airlines',
    email: `
Subject: Your Flight Confirmation - AA1234

Dear John Smith,

Thank you for booking with American Airlines.

Flight Details:
Flight: AA1234
From: LAX (Los Angeles)
To: JFK (New York)
Date: 12/25/2024
Departure: 2:30 PM
Arrival: 10:45 PM
Gate: A12
Terminal: 4
Seat: 14A

Confirmation: ABC123

Please arrive at the airport at least 2 hours before departure.

Safe travels!
American Airlines
`
  },
  {
    airline: 'United Airlines',
    email: `
Subject: United Airlines - Flight Confirmation UA567

Dear Sarah Johnson,

Your United flight is confirmed.

Flight Information:
Flight: UA567
Departure: ORD (Chicago O'Hare)
Arrival: LAX (Los Angeles)
Date: 01/15/2025
Departure Time: 8:15 AM
Arrival Time: 10:30 AM
Gate: B18
Terminal: 1
Seat: 22C

Booking Reference: XYZ789

Thank you for choosing United Airlines.

Best regards,
United Airlines Team
`
  },
  {
    airline: 'Delta Air Lines',
    email: `
Subject: Delta Flight Confirmation - DL2468

Dear Michael Brown,

Welcome aboard Delta Air Lines!

Your Flight Details:
Flight: DL2468
From: ATL (Atlanta)
To: SEA (Seattle)
Date: 02/20/2025
Departure: 11:45 AM
Arrival: 2:20 PM
Gate: C7
Terminal: 2
Seat: 8F

Confirmation Code: DEF456

We look forward to serving you.

Delta Air Lines
`
  },
  {
    airline: 'Southwest Airlines',
    email: `
Subject: Southwest Airlines Boarding Pass - WN1357

Dear Emily Davis,

Thanks for flying Southwest!

Flight: WN1357
Departure: DEN (Denver)
Arrival: PHX (Phoenix)
Date: 03/10/2025
Departure: 6:20 PM
Arrival: 7:55 PM
Gate: A23
Seat: 12B

Confirmation: GHI789

Bags fly free with Southwest!

Southwest Airlines
`
  },
  {
    airline: 'JetBlue Airways',
    email: `
Subject: JetBlue Flight Confirmation B61829

Dear David Wilson,

Your JetBlue flight is ready for takeoff!

Flight Details:
Flight: B61829
From: BOS (Boston)
To: LAX (Los Angeles)
Date: 04/05/2025
Departure: 7:00 AM
Arrival: 10:45 AM
Gate: B12
Terminal: 5
Seat: 15D

Confirmation: JKL012

Experience our award-winning service.

JetBlue Airways
`
  },
  {
    airline: 'Alaska Airlines',
    email: `
Subject: Alaska Airlines Confirmation - AS442

Dear Jennifer Lee,

Thank you for choosing Alaska Airlines.

Flight: AS442
Departure: SEA (Seattle)
Arrival: SFO (San Francisco)
Date: 05/12/2025
Departure: 1:15 PM
Arrival: 3:45 PM
Gate: D15
Terminal: 3
Seat: 9A

Booking Reference: MNO345

Fly with the spirit of the West Coast.

Alaska Airlines
`
  },
  {
    airline: 'Emirates',
    email: `
Subject: Emirates Flight Confirmation EK215

Dear Ahmed Hassan,

Welcome to Emirates.

Flight Information:
Flight: EK215
From: DXB (Dubai)
To: LAX (Los Angeles)
Date: 06/18/2025
Departure: 3:35 AM
Arrival: 8:50 AM
Gate: A1
Terminal: 3
Seat: 7K

Confirmation: PQR678

Experience excellence in the sky.

Emirates
`
  },
  {
    airline: 'Lufthansa',
    email: `
Subject: Lufthansa Flight Confirmation LH441

Dear Hans Mueller,

Guten Tag! Your Lufthansa flight is confirmed.

Flight: LH441
Departure: FRA (Frankfurt)
Arrival: LAX (Los Angeles)
Date: 07/22/2025
Departure: 1:20 PM
Arrival: 4:35 PM
Gate: A50
Terminal: 1
Seat: 12H

Booking Code: STU901

Mehr als nur fliegen.

Lufthansa
`
  },
  {
    airline: 'British Airways',
    email: `
Subject: British Airways Flight Confirmation BA277

Dear James Thompson,

Thank you for choosing British Airways.

Flight Details:
Flight: BA277
From: LHR (London Heathrow)
To: LAX (Los Angeles)
Date: 08/30/2025
Departure: 11:15 AM
Arrival: 2:45 PM
Gate: T5-A12
Terminal: 5
Seat: 14B

Confirmation: VWX234

To fly. To serve.

British Airways
`
  },
  {
    airline: 'Singapore Airlines',
    email: `
Subject: Singapore Airlines Booking Confirmation SQ12

Dear Li Wei,

Thank you for flying with Singapore Airlines.

Flight: SQ12
Departure: SIN (Singapore Changi)
Arrival: LAX (Los Angeles)
Date: 09/15/2025
Departure: 11:35 PM
Arrival: 10:20 PM
Gate: G12
Terminal: 3
Seat: 2A

Reference: YZA567

A great way to fly.

Singapore Airlines
`
  }
]

// Function to get a random sample email
export function getRandomSampleEmail(): string {
  const randomIndex = Math.floor(Math.random() * SAMPLE_EMAILS.length)
  return SAMPLE_EMAILS[randomIndex].email
}

// Legacy export for backward compatibility
export const SAMPLE_EMAIL = SAMPLE_EMAILS[0].email

export function parseEmail(emailContent: string): ParseResult {
  try {
    if (!emailContent.trim()) {
      return {
        success: false,
        error: 'Email content is empty'
      }
    }

    // Create fresh regex patterns for each extraction to avoid state issues
    const flightRegex = /(?:flight|flt)\s*[#:]?\s*([A-Z]{2,3}\s*\d{1,4})/gi
    const confirmationRegex = /(?:confirmation|booking|reference)\s*[#:]\s*([A-Z0-9]{6,8})/gi
    const passengerRegex = /(?:dear|passenger|name)\s*[:]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    const departureRegex = /(?:from|departure)[\s:]*([A-Z]{3})(?:\s|$|\(|,)/gi
    const arrivalRegex = /(?:to|arrival)[\s:]*([A-Z]{3})(?:\s|$|\(|,)/gi
    const gateRegex = /(?:gate)\s*[:]?\s*([A-Z]?\d{1,3}[A-Z]?)/gi
    const terminalRegex = /(?:terminal)\s*[:]?\s*(\d+|[A-Z])/gi
    const seatRegex = /(?:seat)\s*[:]?\s*(\d{1,3}[A-Z])/gi

    // Extract flight information using regex patterns with proper group extraction
    const flightMatch = flightRegex.exec(emailContent)
    const confirmationMatch = confirmationRegex.exec(emailContent)
    const passengerMatch = passengerRegex.exec(emailContent)
    const departureMatch = departureRegex.exec(emailContent)
    const arrivalMatch = arrivalRegex.exec(emailContent)
    const dateMatches = emailContent.match(PATTERNS.date)
    const timeMatches = emailContent.match(PATTERNS.time)
    const gateMatch = gateRegex.exec(emailContent)
    const terminalMatch = terminalRegex.exec(emailContent)
    const seatMatch = seatRegex.exec(emailContent)

    // Validate required fields
    if (!flightMatch || !passengerMatch || !departureMatch || !arrivalMatch) {
      return {
        success: false,
        error: 'Could not find required flight information (flight number, passenger, or airports)'
      }
    }

    // Extract airline code from flight number (use captured group)
    const flightNumber = flightMatch[1]?.trim() || ''
    const airline = flightNumber.match(/^([A-Z]{2,3})/)?.[1] || 'Unknown'

    // Parse dates and times
    const departureDate = dateMatches?.[0] || ''
    const departureTime = timeMatches?.[0] || ''
    const arrivalTime = timeMatches?.[1] || timeMatches?.[0] || ''

    const flightInfo: Omit<FlightInfo, 'id' | 'parsedAt'> = {
      flightNumber: flightNumber,
      airline: airline,
      departureAirport: departureMatch[1]?.trim() || '', // Use captured group
      arrivalAirport: arrivalMatch[1]?.trim() || '',     // Use captured group
      departureDate: departureDate,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      passengerName: passengerMatch[1]?.trim() || '',     // Use captured group
      confirmationCode: confirmationMatch?.[1]?.trim() || '',
      gate: gateMatch?.[1]?.trim() || '',
      terminal: terminalMatch?.[1]?.trim() || '',
      seat: seatMatch?.[1]?.trim() || '',
    }

    return {
      success: true,
      data: flightInfo
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse email'
    }
  }
}
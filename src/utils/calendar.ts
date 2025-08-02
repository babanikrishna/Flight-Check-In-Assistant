import type { FlightInfo, CalendarEvent } from '@/types/flight'

export function generateCalendarEvent(flightInfo: FlightInfo): CalendarEvent {
  const { flightNumber, departureAirport, arrivalAirport, departureDate, departureTime, arrivalTime, passengerName } = flightInfo

  // Convert date and time to ISO format
  const startDateTime = formatDateTime(departureDate, departureTime)
  const endDateTime = formatDateTime(departureDate, arrivalTime || departureTime)

  return {
    title: `Flight ${flightNumber} - ${departureAirport} to ${arrivalAirport}`,
    description: `Passenger: ${passengerName}\\nFlight: ${flightNumber}\\nFrom: ${departureAirport}\\nTo: ${arrivalAirport}${flightInfo.confirmationCode ? `\\nConfirmation: ${flightInfo.confirmationCode}` : ''}${flightInfo.gate ? `\\nGate: ${flightInfo.gate}` : ''}${flightInfo.seat ? `\\nSeat: ${flightInfo.seat}` : ''}`,
    startDateTime,
    endDateTime,
    location: `${departureAirport} Airport`
  }
}

export function generateGoogleCalendarLink(flightInfo: FlightInfo): string {
  const event = generateCalendarEvent(flightInfo)
  const baseUrl = 'https://calendar.google.com/calendar/render'
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.startDateTime}/${event.endDateTime}`,
    details: event.description.replace(/\\n/g, '\n'),
    location: event.location,
    sprop: 'website:flight-check-in-assistant'
  })

  return `${baseUrl}?${params.toString()}`
}

export function generateIcsFile(flightInfo: FlightInfo): string {
  const event = generateCalendarEvent(flightInfo)
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Flight Check-In Assistant//EN',
    'BEGIN:VEVENT',
    `UID:flight-${flightInfo.flightNumber}-${now}`,
    `DTSTAMP:${now}`,
    `DTSTART:${event.startDateTime}`,
    `DTEND:${event.endDateTime}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'DESCRIPTION:Flight Check-in Reminder',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

export function downloadIcsFile(flightInfo: FlightInfo): void {
  const icsContent = generateIcsFile(flightInfo)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  
  link.href = URL.createObjectURL(blob)
  link.download = `flight-${flightInfo.flightNumber}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

function formatDateTime(date: string, time: string): string {
  if (!date || !time) {
    // Fallback to current date if parsing fails
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  try {
    // Parse various date formats
    let parsedDate: Date
    
    if (date.includes('/')) {
      const [month, day, year] = date.split('/')
      parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    } else if (date.includes('-')) {
      parsedDate = new Date(date)
    } else {
      parsedDate = new Date()
    }

    // Parse time
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
    const timeMatch = time.match(timeRegex)
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const ampm = timeMatch[3]?.toUpperCase()

      if (ampm === 'PM' && hours !== 12) {
        hours += 12
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0
      }

      parsedDate.setHours(hours, minutes, 0, 0)
    }

    // Convert to UTC format for calendar
    return parsedDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  } catch (error) {
    console.error('Error parsing date/time:', error)
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
}
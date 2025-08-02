import { useState, useCallback } from 'react'
import type { FlightInfo, ParseResult } from '@/types/flight'
import { parseEmail, getRandomSampleEmail } from '@/utils/emailParser'

interface UseFlightHistoryReturn {
  flights: FlightInfo[]
  currentFlight: FlightInfo | null
  isLoading: boolean
  error: string | null
  emailContent: string
  setEmailContent: (content: string) => void
  parseEmailContent: () => void
  useSampleEmail: () => void
  runDemo: () => Promise<void>
  selectFlight: (flightId: string) => void
  reset: () => void
  clearHistory: () => void
}

// Custom hook for managing multiple flights history
export function useFlightHistory(): UseFlightHistoryReturn {
  const [flights, setFlights] = useState<FlightInfo[]>([])
  const [currentFlight, setCurrentFlight] = useState<FlightInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailContent, setEmailContent] = useState('')

  const generateFlightId = useCallback((flightInfo: Omit<FlightInfo, 'id' | 'parsedAt'>) => {
    // Create unique ID based on flight details
    const baseId = `${flightInfo.airline}-${flightInfo.flightNumber}-${flightInfo.departureDate}-${flightInfo.departureAirport}-${flightInfo.arrivalAirport}`
    return `${baseId}-${Date.now()}`
  }, [])

  const parseEmailContent = useCallback(async () => {
    if (!emailContent.trim()) {
      setError('Please enter an email to parse')
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      const result: ParseResult = parseEmail(emailContent)
      
      if (result.success && result.data) {
        // Create new flight with ID and timestamp
        const newFlight: FlightInfo = {
          ...result.data,
          id: generateFlightId(result.data),
          parsedAt: Date.now()
        }

        // Add to flights history (keep most recent first)
        setFlights(prev => [newFlight, ...prev])
        setCurrentFlight(newFlight)
        setError(null)
        setEmailContent('') // Clear email input after successful parse
      } else {
        setError(result.error || 'Failed to parse email')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [emailContent, generateFlightId])

  const useSampleEmail = useCallback(() => {
    setEmailContent(getRandomSampleEmail())
    setError(null)
  }, [])

  const runDemo = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    const sampleEmail = getRandomSampleEmail()
    setEmailContent(sampleEmail)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      const result: ParseResult = parseEmail(sampleEmail)
      
      if (result.success && result.data) {
        // Create new flight with ID and timestamp
        const newFlight: FlightInfo = {
          ...result.data,
          id: generateFlightId(result.data),
          parsedAt: Date.now()
        }

        // Add to flights history (keep most recent first)
        setFlights(prev => [newFlight, ...prev])
        setCurrentFlight(newFlight)
        setError(null)
        setEmailContent('') // Clear email input after successful parse
      } else {
        setError(result.error || 'Failed to parse email')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [generateFlightId])

  const selectFlight = useCallback((flightId: string) => {
    const flight = flights.find(f => f.id === flightId)
    if (flight) {
      setCurrentFlight(flight)
    }
  }, [flights])

  const reset = useCallback(() => {
    setCurrentFlight(null)
    setEmailContent('')
    setError(null)
    setIsLoading(false)
  }, [])

  const clearHistory = useCallback(() => {
    setFlights([])
    setCurrentFlight(null)
    setEmailContent('')
    setError(null)
    setIsLoading(false)
  }, [])

  return {
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
  }
}
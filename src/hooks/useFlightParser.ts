import { useState, useCallback } from 'react'
import type { FlightInfo, ParseResult } from '@/types/flight'
import { parseEmail, SAMPLE_EMAIL } from '@/utils/emailParser'

interface UseFlightParserReturn {
  flightInfo: FlightInfo | null
  isLoading: boolean
  error: string | null
  emailContent: string
  setEmailContent: (content: string) => void
  parseEmailContent: () => void
  useSampleEmail: () => void
  reset: () => void
}

// Custom hook for managing flight parser state - similar to SwiftUI's @StateObject
export function useFlightParser(): UseFlightParserReturn {
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailContent, setEmailContent] = useState('')

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
        setFlightInfo(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to parse email')
        setFlightInfo(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setFlightInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [emailContent])

  const useSampleEmail = useCallback(() => {
    setEmailContent(SAMPLE_EMAIL)
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setFlightInfo(null)
    setEmailContent('')
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    flightInfo,
    isLoading,
    error,
    emailContent,
    setEmailContent,
    parseEmailContent,
    useSampleEmail,
    reset,
  }
}
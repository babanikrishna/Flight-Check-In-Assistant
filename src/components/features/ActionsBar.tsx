import React, { useState } from 'react'
import { Calendar, Download, RotateCcw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { FlightInfo } from '@/types/flight'
import { generateGoogleCalendarLink, downloadIcsFile } from '@/utils/calendar'

interface ActionsBarProps {
  flightInfo: FlightInfo
  onReset: () => void
}

export function ActionsBar({ flightInfo, onReset }: ActionsBarProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleGoogleCalendar = () => {
    const link = generateGoogleCalendarLink(flightInfo)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadIcs = async () => {
    setIsDownloading(true)
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      downloadIcsFile(flightInfo)
    } catch (error) {
      console.error('Error downloading ICS file:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="animate-slide-up">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-aeonik font-semibold text-gray-900 text-center">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={handleGoogleCalendar}
              variant="primary"
              className="w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add to Google Calendar
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>

            <Button
              onClick={handleDownloadIcs}
              variant="secondary"
              isLoading={isDownloading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download .ics File
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Parse Another Email
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 font-aeonik">
              Calendar events include check-in reminders 2 hours before departure
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
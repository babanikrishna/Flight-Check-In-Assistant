import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmailInputProps {
  emailContent: string
  onEmailContentChange: (content: string) => void
  onParseEmail: () => void
  onUseSampleEmail: () => void
  isLoading: boolean
  error: string | null
}

export function EmailInput({
  emailContent,
  onEmailContentChange,
  onParseEmail,
  onUseSampleEmail,
  isLoading,
  error
}: EmailInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleTextareaClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  return (
    <div className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <label className="block text-sm font-aeonik font-medium text-gray-300">
              Flight Confirmation Email
            </label>
            <textarea
              placeholder={isExpanded 
                ? "Paste your complete flight confirmation email here..." 
                : "Click to paste your flight confirmation email..."
              }
              value={emailContent}
              onChange={(e) => onEmailContentChange(e.target.value)}
              onClick={handleTextareaClick}
              rows={isExpanded ? 12 : 3}
              className="input-field resize-none transition-all duration-300 ease-in-out glass-dark-input"
            />
            {error && (
              <p className="text-sm font-aeonik text-red-400">{error}</p>
            )}
          </div>
          <p className="text-sm text-gray-400 font-aeonik">
            Support for major airlines including American, United, Delta, Southwest, and more.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onParseEmail}
            isLoading={isLoading}
            disabled={!emailContent.trim() || isLoading}
            className="flex-1 glass-dark-button"
          >
            <FileText className="mr-2 h-4 w-4" />
            Parse Email
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-gray-300">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
              <span className="text-sm font-aeonik font-medium">Parsing email...</span>
            </div>
          </div>
        )}
    </div>
  )
}
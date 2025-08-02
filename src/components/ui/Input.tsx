import React from 'react'
import { cn } from '@/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-aeonik font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'input-field',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-aeonik text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
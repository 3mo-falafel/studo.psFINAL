"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: string | null
  onExpire?: () => void
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ endTime, onExpire, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!endTime) return

    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = +new Date(endTime) - +new Date()

      if (difference <= 0) {
        setIsExpired(true)
        if (onExpire) onExpire()
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpire])

  if (!endTime || isExpired) return null

  if (!timeLeft) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-4 h-4" />
      <div className="flex items-center gap-1 font-mono text-sm md:text-base">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-lg md:text-xl font-bold">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase">Days</span>
            </div>
            <span className="text-lg">:</span>
          </>
        )}
        <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-lg md:text-xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase">Hrs</span>
        </div>
        <span className="text-lg">:</span>
        <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-lg md:text-xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase">Min</span>
        </div>
        <span className="text-lg">:</span>
        <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-lg md:text-xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase">Sec</span>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    fade: "",
  }

  const initialClass = directionClasses[direction]

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${initialClass}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

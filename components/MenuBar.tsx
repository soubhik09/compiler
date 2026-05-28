'use client'

import { useState, useEffect } from 'react'

export default function MenuBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-7 bg-macos-bg/80 backdrop-blur-2xl flex items-center justify-between px-4 text-[13px] text-macos-text/90 font-sf border-b border-macos-border/30 select-none z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-macos-muted" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
        </div>
        <span className="font-semibold text-macos-text">Code Compiler</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">File</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">Edit</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">View</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">Run</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">Window</span>
        <span className="text-macos-muted hover:text-macos-text cursor-pointer">Help</span>
      </div>
      <div className="flex items-center gap-4 text-macos-muted">
        <span>{time}</span>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface TerminalProps {
  output: string
  error: string
  isRunning: boolean
  fontSize: number
  onFontSizeChange: (size: number) => void
}

const MIN_FONT = 10
const MAX_FONT = 24

export default function Terminal({ output, error, isRunning, fontSize, onFontSizeChange }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output, error])

  return (
    <div className="h-full bg-[#1a1a1a] flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#1a1a1d]">
        <div className="flex items-center gap-3">
          <span className="text-macos-muted text-[11px] font-sf">TERMINAL</span>
          <span className="text-macos-muted/30">|</span>
          <span className="text-macos-green/70 text-[11px] font-sf">
            {isRunning ? '● Running...' : '● Ready'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onFontSizeChange(Math.max(MIN_FONT, fontSize - 1))}
            className="w-5 h-5 flex items-center justify-center rounded text-macos-muted hover:text-macos-text hover:bg-white/5 text-[11px]">
            −
          </button>
          <span className="text-[9px] text-macos-muted/50 font-mono w-5 text-center">{fontSize}</span>
          <button onClick={() => onFontSizeChange(Math.min(MAX_FONT, fontSize + 1))}
            className="w-5 h-5 flex items-center justify-center rounded text-macos-muted hover:text-macos-text hover:bg-white/5 text-[11px]">
            +
          </button>
        </div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-auto p-3 space-y-0.5 font-mono" style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}>
        <div className="text-macos-green/70">
          <span className="text-macos-muted">$</span> code-compiler run
        </div>

        {output && (
          <div className="text-[#d4d4d4] whitespace-pre-wrap">{output}</div>
        )}

        {error && (
          <div className="text-red-400 whitespace-pre-wrap">{error}</div>
        )}

        {!isRunning && !output && !error && (
          <div className="text-macos-muted/30 mt-2">Click "Run" to execute your code...</div>
        )}

        {!isRunning && (output || error) && (
          <div className="text-macos-muted mt-2">
            <span className="text-macos-green/70">$</span> Process finished
          </div>
        )}
      </div>
    </div>
  )
}

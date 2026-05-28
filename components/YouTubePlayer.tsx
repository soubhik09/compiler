'use client'

import { useState, useCallback } from 'react'

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function YouTubePlayer() {
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handlePlay = useCallback(() => {
    setError('')
    if (!url.trim()) return
    const id = extractVideoId(url.trim())
    if (id) {
      setVideoId(id)
    } else {
      setError('Invalid YouTube URL. Paste a link like https://youtube.com/watch?v=...')
    }
  }, [url])

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f]">
      {/* URL Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#181818] border-b border-[#1a1a1d] flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 bg-[#0f0f0f] rounded-lg px-3 py-1.5 border border-[#333]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
            placeholder="Paste YouTube URL and press Enter..."
            className="flex-1 bg-transparent text-[12px] text-white/90 placeholder:text-white/30 outline-none font-sf"
          />
        </div>
        <button
          onClick={handlePlay}
          className="px-3 py-1.5 rounded-lg text-[12px] font-sf font-medium bg-[#ff0000]/90 hover:bg-[#ff0000] text-white transition-all active:scale-95"
        >
          Play
        </button>
      </div>

      {/* Player */}
      <div className="flex-1 flex items-center justify-center">
        {videoId ? (
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/30">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/>
            </svg>
            <p className="text-[13px] font-sf">Paste a YouTube URL above to start watching</p>
          </div>
        )}
      </div>

      {error && (
        <div className="px-3 py-1.5 bg-red-500/10 text-red-400 text-[11px] font-sf text-center">{error}</div>
      )}
    </div>
  )
}

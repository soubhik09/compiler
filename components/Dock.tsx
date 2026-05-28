'use client'

import { motion } from 'framer-motion'

interface DockProps {
  compilerOpen: boolean
  onCompilerClick: () => void
  youtubeOpen: boolean
  onYoutubeClick: () => void
}

export default function Dock({ compilerOpen, onCompilerClick, youtubeOpen, onYoutubeClick }: DockProps) {
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="bg-macos-bg/60 backdrop-blur-2xl rounded-[16px] px-3 py-1.5 flex items-center gap-2 border border-macos-border/30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
      >
        {/* Compiler */}
        <motion.div
          className="w-12 h-12 rounded-[11px] flex items-center justify-center cursor-pointer text-[28px] hover:bg-white/10 transition-colors relative group"
          whileHover={{ scale: 1.35, y: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCompilerClick}
        >
          <span>⚡</span>
          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-macos-bg/90 text-macos-text text-[10px] px-2 py-1 rounded whitespace-nowrap">
            Compiler
          </div>
          <div className={`absolute -bottom-1 w-1 h-1 rounded-full transition-colors ${
            compilerOpen ? 'bg-white' : 'bg-macos-muted/30'
          }`} />
        </motion.div>

        {/* YouTube */}
        <motion.div
          className="w-12 h-12 rounded-[11px] flex items-center justify-center cursor-pointer text-[28px] hover:bg-white/10 transition-colors relative group"
          whileHover={{ scale: 1.35, y: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={onYoutubeClick}
        >
          <span>▶</span>
          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-macos-bg/90 text-macos-text text-[10px] px-2 py-1 rounded whitespace-nowrap">
            YouTube
          </div>
          <div className={`absolute -bottom-1 w-1 h-1 rounded-full transition-colors ${
            youtubeOpen ? 'bg-white' : 'bg-macos-muted/30'
          }`} />
        </motion.div>
      </motion.div>
    </div>
  )
}

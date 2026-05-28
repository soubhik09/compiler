'use client'

import { ReactNode, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MacWindowProps {
  title: string
  children: ReactNode
  className?: string
  titlebar?: ReactNode
  isActive?: boolean
  isOpen: boolean
  onClick?: () => void
  onClose?: () => void
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
}

export default function MacWindow({
  title,
  children,
  className = '',
  titlebar,
  isActive = true,
  isOpen,
  onClick,
  onClose,
  defaultPosition,
  defaultSize = { width: 700, height: 600 },
  minSize = { width: 360, height: 300 },
}: MacWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const centeredPos = useRef<{ x: number; y: number } | null>(null)
  const getCenteredPos = useCallback(() => {
    if (centeredPos.current) return centeredPos.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    centeredPos.current = {
      x: Math.max(0, (vw - defaultSize.width) / 2),
      y: Math.max(0, (vh - defaultSize.height) / 2),
    }
    return centeredPos.current
  }, [defaultSize.width, defaultSize.height])

  const geo = useRef({
    x: defaultPosition?.x ?? getCenteredPos().x,
    y: defaultPosition?.y ?? getCenteredPos().y,
    w: defaultSize.width,
    h: defaultSize.height,
  })

  const applyGeo = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.style.left = geo.current.x + 'px'
    el.style.top = geo.current.y + 'px'
    el.style.width = geo.current.w + 'px'
    el.style.height = geo.current.h + 'px'
  }, [])

  useEffect(() => {
    applyGeo()
  }, [applyGeo])

  const clampToViewport = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    geo.current.x = Math.max(-geo.current.w + 40, Math.min(vw - 40, geo.current.x))
    geo.current.y = Math.max(0, Math.min(vh - 48, geo.current.y))
    geo.current.w = Math.min(geo.current.w, vw - geo.current.x)
    geo.current.h = Math.min(geo.current.h, vh - geo.current.y)
  }, [])

  const showOverlay = useCallback(() => {
    overlayRef.current?.style.setProperty('display', 'block')
  }, [])
  const hideOverlay = useCallback(() => {
    overlayRef.current?.style.setProperty('display', 'none')
  }, [])

  const startDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    showOverlay()
    const startX = e.clientX
    const startY = e.clientY
    const origX = geo.current.x
    const origY = geo.current.y

    const onMove = (ev: PointerEvent) => {
      geo.current.x = origX + (ev.clientX - startX)
      geo.current.y = origY + (ev.clientY - startY)
      clampToViewport()
      applyGeo()
    }
    const onUp = () => {
      hideOverlay()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [applyGeo, clampToViewport, showOverlay, hideOverlay])

  const startResize = useCallback((dir: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showOverlay()
    const startX = e.clientX
    const startY = e.clientY
    const orig = { ...geo.current }
    const vw = window.innerWidth
    const vh = window.innerHeight

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      if (dir.includes('e')) {
        geo.current.w = Math.max(minSize.width, Math.min(orig.w + dx, vw - orig.x))
      }
      if (dir.includes('s')) {
        geo.current.h = Math.max(minSize.height, Math.min(orig.h + dy, vh - orig.y))
      }
      if (dir.includes('w')) {
        const safeShift = Math.max(-orig.x, Math.min(dx, orig.w - minSize.width))
        geo.current.w = orig.w - safeShift
        geo.current.x = orig.x + safeShift
        if (geo.current.w < minSize.width) {
          geo.current.w = minSize.width
          geo.current.x = orig.x + orig.w - minSize.width
        }
        if (geo.current.x < 0) {
          geo.current.x = 0
          geo.current.w = orig.x + orig.w
        }
      }
      if (dir.includes('n')) {
        const clamped = Math.min(dy, orig.h - minSize.height)
        geo.current.h = orig.h - clamped
        geo.current.y = orig.y + clamped
        if (geo.current.y < 0) {
          geo.current.y = 0
          geo.current.h = orig.y + orig.h
        }
      }

      geo.current.w = Math.max(minSize.width, Math.min(geo.current.w, vw))
      geo.current.h = Math.max(minSize.height, Math.min(geo.current.h, vh))
      applyGeo()
    }
    const onUp = () => {
      hideOverlay()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [applyGeo, minSize, showOverlay, hideOverlay])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="window"
          ref={containerRef}
          className={`absolute rounded-[10px] overflow-hidden shadow-macos flex flex-col will-change-transform ${
            isActive ? 'z-30' : 'z-10'
          } ${className}`}
          style={{
            left: geo.current.x,
            top: geo.current.y,
            width: geo.current.w,
            height: geo.current.h,
          }}
          onClick={onClick}
          initial={{ opacity: 0, scale: 0.4, y: 300, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.6, y: 400, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.9 }}
        >
          {/* Title Bar */}
          <div
            className="h-12 bg-[#2d2d30] flex items-center px-4 cursor-grab active:cursor-grabbing border-b border-[#1a1a1d] select-none flex-shrink-0"
            onPointerDown={startDrag}
          >
            <div className="flex items-center gap-2 mr-4">
              <button
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group"
                onClick={(e) => { e.stopPropagation(); onClose?.() }}
              >
                <svg className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-black/60" viewBox="0 0 6 6">
                  <line x1="0" y1="0" x2="6" y2="6" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="6" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </button>
              <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[13px] text-macos-muted font-sf">{title}</span>
            </div>
            <div className="w-[52px]" />
            {titlebar}
          </div>

          {/* Content */}
          <div className="bg-[#1e1e1e] flex-1 overflow-hidden relative">
            {children}
            <div ref={overlayRef} className="absolute inset-0" style={{ display: 'none' }} />
          </div>

          {/* Resize Handles */}
          <div className="absolute top-12 right-0 bottom-4 w-1.5 cursor-e-resize hover:bg-macos-accent/20 z-50"
            onPointerDown={startResize('e')} />
          <div className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize hover:bg-macos-accent/20 z-50"
            onPointerDown={startResize('s')} />
          <div className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-50 group"
            onPointerDown={startResize('se')}>
            <svg className="w-5 h-5 text-macos-muted/30 group-hover:text-macos-accent transition-colors" viewBox="0 0 20 20">
              <line x1="17" y1="7" x2="7" y2="17" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="17" y1="12" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute top-12 left-0 bottom-4 w-1.5 cursor-w-resize hover:bg-macos-accent/20 z-50"
            onPointerDown={startResize('w')} />
          <div className="absolute top-0 left-12 right-12 h-1.5 cursor-n-resize hover:bg-macos-accent/20 z-50"
            onPointerDown={startResize('n')} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

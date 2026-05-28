'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

import MacWindow from '@/components/MacWindow'
import Dock from '@/components/Dock'
import CodeEditor from '@/components/CodeEditor'
import Terminal from '@/components/Terminal'
import LanguageSelector, { defaultCode, type Language } from '@/components/LanguageSelector'
import YouTubePlayer from '@/components/YouTubePlayer'

const langExt: Record<Language, string> = {
  python: 'py',
  javascript: 'js',
  cpp: 'cpp',
  c: 'c',
  java: 'java',
}

const extToLang: Record<string, Language> = {
  py: 'python', js: 'javascript', ts: 'javascript',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp',
  c: 'c',
  java: 'java',
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [topWindow, setTopWindow] = useState<'compiler' | 'youtube'>('compiler')
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(defaultCode.python)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [splitRatio, setSplitRatio] = useState(0.45)
  const [editorFontSize, setEditorFontSize] = useState(13)
  const [terminalFontSize, setTerminalFontSize] = useState(12)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setCode(defaultCode[lang])
    setOutput('')
    setError('')
  }, [])

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setOutput('')
    setError('')

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const data = await response.json()

      if (data.error && !data.output) {
        setError(data.error)
      } else {
        setOutput(data.output || '')
        if (data.error) setError(data.error)
      }

      if (data.executionTime) {
        setOutput(prev => prev + `\n\n--- Completed in ${data.executionTime}ms ---`)
      }
    } catch {
      setError('Failed to execute. Make sure the compiler/interpreter is installed.')
    } finally {
      setIsRunning(false)
    }
  }, [code, language])

  const startSplitDrag = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const container = splitContainerRef.current
    if (!container) return
    const onMove = (ev: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      setSplitRatio(Math.min(0.7, Math.max(0.2, (ev.clientX - rect.left) / rect.width)))
    }
    const onUp = () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp) }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [])

  // Import file
  const handleImportFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const lang = extToLang[ext]
    if (lang) {
      setLanguage(lang)
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCode(text)
      setOutput('')
      setError('')
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  // Download file
  const handleDownload = useCallback(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const filename = `${yyyy}-${mm}-${dd}.${langExt[language]}`
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [code, language])

  if (!mounted) return null

  return (
    <div className="h-screen w-screen macos-wallpaper overflow-hidden relative">
      <MacWindow
        title="Code Compiler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onClick={() => setTopWindow('compiler')}
        defaultSize={{ width: 1280, height: 680 }}
        minSize={{ width: 700, height: 400 }}
        isActive={topWindow === 'compiler'}
      >
        <div className="h-full flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#1a1a1d] flex-shrink-0">
            <LanguageSelector language={language} onChange={handleLanguageChange} />
            <div className="flex items-center gap-2">
              <button onClick={() => { setOutput(''); setError('') }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-sf text-macos-muted hover:text-macos-text hover:bg-white/5 transition-all">
                Clear
              </button>
              <button onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg text-[12px] font-sf text-macos-muted hover:text-macos-text hover:bg-white/5 transition-all flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download
              </button>
              <button onClick={runCode} disabled={isRunning}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-sf font-medium transition-all ${
                  isRunning ? 'bg-macos-muted/20 text-macos-muted cursor-not-allowed'
                    : 'bg-macos-green/90 hover:bg-macos-green text-white shadow-md hover:shadow-lg active:scale-95'
                }`}>
                {isRunning ? <><span className="animate-spin">⏳</span> Running...</> : <><span>▶</span> Run</>}
              </button>
            </div>
          </div>

          {/* Editor + Terminal */}
          <div ref={splitContainerRef} className="flex-1 flex min-h-0">
            <div style={{ width: `${splitRatio * 100}%` }} className="min-w-0">
              <CodeEditor code={code} onChange={setCode} language={language} fontSize={editorFontSize} onFontSizeChange={setEditorFontSize} />
            </div>
            <div className="w-[3px] bg-[#333] hover:bg-macos-accent/60 cursor-col-resize flex-shrink-0 transition-colors"
              onPointerDown={startSplitDrag} />
            <div className="flex-1 min-w-0">
              <Terminal output={output} error={error} isRunning={isRunning} fontSize={terminalFontSize} onFontSizeChange={setTerminalFontSize} />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-t border-[#1a1a1d] flex-shrink-0">
            <button onClick={handleImportFile}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-sf text-macos-muted hover:text-macos-text hover:bg-white/5 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Import File
            </button>
            <input ref={fileInputRef} type="file" accept=".py,.js,.ts,.c,.cpp,.cxx,.cc,.java" onChange={handleFileChange} className="hidden" />
            <span className="text-[10px] text-macos-muted/30 font-mono">{code.split('\n').length} lines · {language}</span>
          </div>
        </div>
      </MacWindow>

      <MacWindow
        title="YouTube"
        isOpen={youtubeOpen}
        onClose={() => setYoutubeOpen(false)}
        onClick={() => setTopWindow('youtube')}
        defaultSize={{ width: 960, height: 600 }}
        minSize={{ width: 400, height: 300 }}
        isActive={topWindow === 'youtube'}
      >
        <YouTubePlayer />
      </MacWindow>

      <Dock
        compilerOpen={isOpen}
        onCompilerClick={() => { setIsOpen(prev => !prev); setTopWindow('compiler') }}
        youtubeOpen={youtubeOpen}
        onYoutubeClick={() => { setYoutubeOpen(prev => !prev); setTopWindow('youtube') }}
      />
    </div>
  )
}

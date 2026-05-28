'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type { Language } from './LanguageSelector'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  language: Language
  fontSize: number
  onFontSizeChange: (size: number) => void
}

const MIN_FONT = 10
const MAX_FONT = 32

const langMap: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  cpp: 'cpp',
  c: 'c',
  java: 'java',
}

const monacoTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'delimiter', foreground: 'D4D4D4' },
  ],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editor.lineHighlightBackground': '#2a2d2e',
    'editor.selectionBackground': '#264f78',
    'editor.inactiveSelectionBackground': '#3a3d41',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#c6c6c6',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    'editor.selectionHighlightBackground': '#add6ff26',
    'editorCursor.foreground': '#ffffff',
    'editorWhitespace.foreground': '#3b3b3b',
    'editorBracketMatch.background': '#0064001a',
    'editorBracketMatch.border': '#888888',
    'minimap.background': '#1e1e1e',
  },
}

export default function CodeEditor({ code, onChange, language, fontSize, onFontSizeChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const decorationsRef = useRef<any[]>([])
  const monacoRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  const applyFontSize = useCallback((size: number) => {
    if (!editorRef.current) return
    editorRef.current.updateOptions({ fontSize: size, lineHeight: Math.round(size * 1.55) })
  }, [])

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    monaco.editor.defineTheme('compiler-dark', monacoTheme)
    monaco.editor.setTheme('compiler-dark')

    editor.updateOptions({
      fontSize,
      lineHeight: Math.round(fontSize * 1.55),
      fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
      fontLigatures: true,
      minimap: { enabled: true, scale: 2, showSlider: 'mouseover' },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      padding: { top: 8, bottom: 8 },
      suggest: { showKeywords: true, showSnippets: true },
      quickSuggestions: { other: true, comments: false, strings: false },
      parameterHints: { enabled: true },
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
    })
  }, [])

  // Sync fontSize prop → editor
  useEffect(() => {
    applyFontSize(fontSize)
  }, [fontSize, applyFontSize])

  // Ctrl+Scroll / Ctrl+= / Ctrl+- zoom — attach to Monaco's own DOM node
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const el = editor.getDomNode()
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        onFontSizeChange(
          e.deltaY < 0
            ? Math.min(MAX_FONT, fontSize + 1)
            : Math.max(MIN_FONT, fontSize - 1)
        )
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault()
          e.stopPropagation()
          onFontSizeChange(Math.min(MAX_FONT, fontSize + 1))
        } else if (e.key === '-') {
          e.preventDefault()
          e.stopPropagation()
          onFontSizeChange(Math.max(MIN_FONT, fontSize - 1))
        } else if (e.key === '0') {
          e.preventDefault()
          e.stopPropagation()
          onFontSizeChange(13)
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('keydown', onKeyDown)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('keydown', onKeyDown)
    }
  }, [fontSize, onFontSizeChange])

  if (!ready) return <div className="h-full w-full bg-[#1e1e1e]" />

  return (
    <div ref={containerRef} className="h-full w-full relative">
      <Editor
        height="100%"
        language={langMap[language]}
        value={code}
        onChange={(val) => onChange(val || '')}
        onMount={handleMount}
        theme="compiler-dark"
        loading={
          <div className="h-full w-full bg-[#1e1e1e] flex items-center justify-center">
            <div className="text-macos-muted text-sm font-sf">Loading editor...</div>
          </div>
        }
        options={{
          fontSize,
          lineHeight: Math.round(fontSize * 1.55),
        }}
      />

      {/* Zoom indicator — bottom-right */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#252526]/90 backdrop-blur rounded-md border border-[#333] px-1 py-0.5 z-10">
        <button
          onClick={() => onFontSizeChange(Math.max(MIN_FONT, fontSize - 1))}
          className="w-6 h-6 flex items-center justify-center text-macos-muted hover:text-macos-text rounded transition-colors text-sm"
        >
          −
        </button>
        <span className="text-[10px] text-macos-muted font-mono w-7 text-center">{fontSize}px</span>
        <button
          onClick={() => onFontSizeChange(Math.min(MAX_FONT, fontSize + 1))}
          className="w-6 h-6 flex items-center justify-center text-macos-muted hover:text-macos-text rounded transition-colors text-sm"
        >
          +
        </button>
      </div>
    </div>
  )
}

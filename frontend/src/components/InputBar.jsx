import { useRef, useEffect } from 'react'
import axios from 'axios'

export default function InputBar({ onSend, isLoading }) {
  const textareaRef = useRef(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async() => {
    const val = textareaRef.current?.value?.trim()
    if (!val || isLoading) return
    onSend(val)
    textareaRef.current.value = ''
    textareaRef.current.style.height = 'auto'

    

  }

  return (
    <div
      className="px-8 py-5"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="flex items-end gap-3 rounded-xl px-4 py-3"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          maxWidth: '860px',
          margin: '0 auto',
          transition: 'border-color 0.15s',
        }}
        onFocusCapture={e => {
          e.currentTarget.style.borderColor = 'var(--accent-soft)'
        }}
        onBlurCapture={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Describe the problem you want to battle…"
          onInput={autoResize}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm outline-none py-1"
          style={{
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            minHeight: '24px',
          }}
        />

        <button
          onClick={handleSend}
          disabled={isLoading}
          className="flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: isLoading ? 'var(--bg-hover)' : 'var(--accent)',
            color: isLoading ? 'var(--text-muted)' : 'white',
            border: 'none',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      <div className="text-center mt-2.5">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Press <kbd
            className="px-1.5 py-0.5 rounded text-xs mx-0.5"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
            }}
          >Enter</kbd> to send · <kbd
            className="px-1.5 py-0.5 rounded text-xs mx-0.5"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
            }}
          >Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  )
}

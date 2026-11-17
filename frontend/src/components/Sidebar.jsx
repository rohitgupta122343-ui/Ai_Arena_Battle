import { useState } from 'react'

function formatTime(dateInput) {
  // Date input chahe string ho ya Date object, yeh use Date bana dega
  const date = new Date(dateInput)
  
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  
  if (isNaN(mins)) return 'Just now' // Safety check agar invalid ho
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

function truncate(str, len = 38) {
  if (!str) return 'New conversation'
  return str.length > len ? str.slice(0, len) + '…' : str
}

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat }) {
  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: '220px',
        minWidth: '220px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--accent)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>
        <span
          className="font-semibold tracking-tight text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          AI Battle
        </span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{
            background: 'var(--bg-hover)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-soft)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-hover)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New battle
        </button>
      </div>

      {/* Chats label */}
      <div className="px-5 py-2">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          History
        </span>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2">
        {chats.length === 0 && (
          <div className="px-3 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            No battles yet
          </div>
        )}
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-100 cursor-pointer group"
            style={{
              background: activeChatId === chat.id ? 'var(--accent-glow)' : 'transparent',
              borderLeft: activeChatId === chat.id
                ? '2px solid var(--accent)'
                : '2px solid transparent',
            }}
            onMouseEnter={e => {
              if (activeChatId !== chat.id) {
                e.currentTarget.style.background = 'var(--bg-hover)'
              }
            }}
            onMouseLeave={e => {
              if (activeChatId !== chat.id) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <div
              className="text-xs font-medium truncate leading-snug"
              style={{ color: activeChatId === chat.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {truncate(chat.firstMessage)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {chat.messages.length} {chat.messages.length === 1 ? 'message' : 'messages'} · {formatTime(chat.createdAt)}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-4 text-xs"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        Powered by AI
      </div>
    </aside>
  )
}

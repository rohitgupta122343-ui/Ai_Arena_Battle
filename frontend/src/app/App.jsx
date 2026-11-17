import { useState, useRef, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import MessageCard from '../components/MessageCard'
import InputBar from '../components/InputBar'
import axios from 'axios'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 md:px-8 py-12" style={{ gap: '24px' }}>
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, rgba(124,106,247,0.2) 0%, rgba(79,156,249,0.1) 100%)',
          border: '1px solid rgba(124,106,247,0.25)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="url(#grad)"
          />
          <defs>
            <linearGradient id="grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7c6af7" />
              <stop offset="1" stopColor="#4f9cf9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center" style={{ maxWidth: 420 }}>
        <h2 className="text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Start an AI Battle
        </h2>
        <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Describe a programming problem or any challenge. Two AI solutions will compete,
          and an AI judge will score and reason about each one.
        </p>
      </div>

      <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
        {[
          'Maximum depth of binary tree',
          'Reverse a linked list',
          'Two sum problem',
        ].map((suggestion) => (
          <div
            key={suggestion}
            className="px-3 py-1.5 rounded-full text-xs cursor-default"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="py-6 md:py-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex flex-col gap-5">
        {/* User row */}
        <div className="flex items-start gap-3">
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: 30, height: 30, background: 'var(--bg-hover)' }}
          />
          <div className="flex flex-col gap-2 flex-1">
            <div className="rounded-md animate-pulse" style={{ height: 10, width: 32, background: 'var(--bg-hover)' }} />
            <div className="rounded-md animate-pulse" style={{ height: 14, width: '70%', background: 'var(--bg-hover)' }} />
          </div>
        </div>

        {/* Two solution skeletons - Mobile par column, Desktop par row */}
        <div className="flex flex-col md:flex-row gap-4">
          {[0, 1].map(i => (
            <div
              key={i}
              className="flex-1 rounded-xl p-4 md:p-5 flex flex-col gap-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-md animate-pulse" style={{ width: 28, height: 28, background: 'var(--bg-hover)' }} />
                <div className="rounded-md animate-pulse" style={{ width: 80, height: 12, background: 'var(--bg-hover)' }} />
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)' }} />
              <div className="flex flex-col gap-2">
                {[90, 70, 85, 60].map((w, j) => (
                  <div
                    key={j}
                    className="rounded-md animate-pulse"
                    style={{ height: 10, width: `${w}%`, background: 'var(--bg-hover)' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Judge skeleton */}
        <div
          className="rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full animate-pulse" style={{ width: 56, height: 56, background: 'var(--bg-hover)' }} />
          </div>
          <div className="flex flex-col gap-2 flex-1 w-full">
            {[60, 90, 75].map((w, i) => (
              <div
                key={i}
                className="rounded-md animate-pulse"
                style={{ height: 10, width: `${w}%`, background: 'var(--bg-hover)' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '300ms' }} />
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          AI is battling…
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('ai_battle_chats')
    return saved ? JSON.parse(saved) : []
  })
  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem('ai_battle_chats')
    const parsed = saved ? JSON.parse(saved) : []
    return parsed.length > 0 ? parsed[0].id : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile sidebar toggle state
  const bottomRef = useRef(null)

  const activeChat = chats.find(c => c.id === activeChatId)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
    localStorage.setItem('ai_battle_chats', JSON.stringify(chats))
  }, [chats, scrollToBottom])

  const handleNewChat = () => {
    const id = generateId()
    setChats(prev => [
      {
        id,
        firstMessage: null,
        messages: [],
        createdAt: new Date(),
      },
      ...prev,
    ])
    setActiveChatId(id)
    setIsSidebarOpen(false) // Mobile par chat select/create hote hi sidebar band karein
  }

  const handleSelectChat = (id) => {
    setActiveChatId(id)
    setIsSidebarOpen(false) // Mobile par chat select hote hi sidebar band karein
  }

  const handleSend = async (problem) => {
    let chatId = activeChatId
    if (!chatId) {
      chatId = generateId()
      setChats(prev => [
        {
          id: chatId,
          firstMessage: problem,
          messages: [],
          createdAt: new Date(),
        },
        ...prev,
      ])
      setActiveChatId(chatId)
    } else {
      setChats(prev =>
        prev.map(c =>
          c.id === chatId && !c.firstMessage
            ? { ...c, firstMessage: problem }
            : c
        )
      )
    }

    setIsLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/invoke', {
        input: problem
      })

      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? {
                ...c,
                firstMessage: c.firstMessage || problem,
                messages: [...c.messages, res.data.result],
              }
            : c
        )
      )
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: 'var(--bg-base)' }}>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper - Mobile par slide-over drawer, Desktop par normal */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-4 md:px-8 py-3.5 md:py-4 flex-shrink-0"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-base)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg md:hidden text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="truncate">
              <h1 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {activeChat?.firstMessage
                  ? activeChat.firstMessage.length > 50
                    ? activeChat.firstMessage.slice(0, 50) + '…'
                    : activeChat.firstMessage
                  : 'AI Battle'}
              </h1>
              {activeChat?.messages.length > 0 && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {activeChat.messages.length} {activeChat.messages.length === 1 ? 'battle' : 'battles'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e55' }}
            />
            <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
              2 models ready
            </span>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex flex-col px-4 sm:px-6 md:px-12" style={{ maxWidth: '900px' }}>
            {(!activeChat || activeChat.messages.length === 0) && !isLoading ? (
              <EmptyState />
            ) : (
              <>
                {activeChat?.messages.map((msg, i) => (
                  <MessageCard key={i} message={msg} index={i} />
                ))}
                {isLoading && <LoadingCard />}
              </>
            )}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>
        </div>

        {/* Input */}
        <InputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
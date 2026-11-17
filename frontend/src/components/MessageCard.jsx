import MarkdownRenderer from './MarkdownRenderer'

function ScoreBadge({ score, label, color }) {
  const max = 10
  const pct = (score / max) * 100
  const radius = 24
  const circ = 2 * Math.PI * radius
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="4"
          />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span
          className="absolute text-base font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {score}
        </span>
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

function SolutionCard({ title, content, color, icon }) {
  return (
    <div
      className="flex-1 rounded-xl p-4 md:p-5 flex flex-col gap-3"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-md text-xs font-bold"
          style={{
            width: 28,
            height: 28,
            background: color + '22',
            color: color,
            border: `1px solid ${color}44`,
          }}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <div
          className="ml-auto w-2 h-2 rounded-full"
          style={{ background: color, opacity: 0.7 }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}

function JudgePanel({ judge }) {
  const winner =
    judge.solution_1_score > judge.solution_2_score
      ? 'Solution A'
      : judge.solution_2_score > judge.solution_1_score
      ? 'Solution B'
      : 'Tie'

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Judge header strip */}
      <div
        className="flex items-center justify-between px-4 md:px-5 py-3"
        style={{
          background: 'linear-gradient(90deg, rgba(124,106,247,0.15) 0%, rgba(124,106,247,0.04) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-md"
            style={{
              width: 26,
              height: 26,
              background: 'rgba(124,106,247,0.2)',
              border: '1px solid rgba(124,106,247,0.3)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="2.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Judge's Verdict
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(124,106,247,0.15)',
            color: '#a99bff',
            border: '1px solid rgba(124,106,247,0.25)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Winner: {winner}
        </div>
      </div>

      {/* Scores row: Mobile par flex-col, Desktop par flex-row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-start gap-6 px-4 md:px-6 pt-5 pb-5">
        {/* Solution A block */}
        <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3" style={{ minWidth: 80 }}>
          <ScoreBadge score={judge.solution_1_score} label="Sol. A" color="var(--sol-a)" />
          <div className="flex-1 md:hidden">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--sol-a)' }}>
              Solution A · Reasoning
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {judge.solution_1_reasoning}
            </p>
          </div>
        </div>

        {/* Reasoning A (Desktop view) */}
        <div className="hidden md:block flex-1">
          <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--sol-a)' }}>
            Solution A · Reasoning
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {judge.solution_1_reasoning}
          </p>
        </div>

        {/* Divider (Desktop only) */}
        <div
          className="hidden md:block self-stretch"
          style={{ width: '1px', background: 'var(--border-subtle)', flexShrink: 0 }}
        />

        {/* Horizontal divider for mobile */}
        <div className="block md:hidden w-full" style={{ height: '1px', background: 'var(--border-subtle)' }} />

        {/* Solution B block */}
        <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3" style={{ minWidth: 80 }}>
          <ScoreBadge score={judge.solution_2_score} label="Sol. B" color="var(--sol-b)" />
          <div className="flex-1 md:hidden">
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--sol-b)' }}>
              Solution B · Reasoning
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {judge.solution_2_reasoning}
            </p>
          </div>
        </div>

        {/* Reasoning B (Desktop view) */}
        <div className="hidden md:block flex-1">
          <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--sol-b)' }}>
            Solution B · Reasoning
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {judge.solution_2_reasoning}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MessageCard({ message, index }) {
  return (
    <div className="flex flex-col gap-5 py-6 md:py-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Problem / User message */}
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
          style={{
            width: 30,
            height: 30,
            background: 'var(--bg-hover)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            marginTop: 1,
          }}
        >
          U
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            You
          </div>
          <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-primary)', fontWeight: 450 }}>
            {message.problem}
          </p>
        </div>
      </div>

      {/* Solutions side by side on desktop, stacked on mobile */}
      <div className="flex flex-col md:flex-row gap-4">
        <SolutionCard
          title="Solution A"
          content={message.solution_1}
          color="var(--sol-a)"
          icon="A"
        />
        <SolutionCard
          title="Solution B"
          content={message.solution_2}
          color="var(--sol-b)"
          icon="B"
        />
      </div>

      {/* Judge panel */}
      <JudgePanel judge={message.judge} />
    </div>
  )
}
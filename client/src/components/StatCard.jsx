import { SquareCheck, SquareX } from 'lucide-react'

const variants = {
  complete: {
    label: 'Task Complete',
    Icon: SquareCheck,
    card: 'bg-[#eef1ff]',
    badge: 'bg-[#a3b4f7] text-[#1f2b75]',
  },
  pending: {
    label: 'Task Pending',
    Icon: SquareX,
    card: 'bg-[#ffe6e6]',
    badge: 'bg-[#f9b0b0] text-[#c62121]',
  },
}

export default function StatCard({ variant, count }) {
  const { label, Icon, card, badge } = variants[variant]

  return (
    <div className={`flex min-h-24 gap-3 py-4 pr-2 pl-[15px] ${card}`}>
      <span className={`grid size-7 shrink-0 place-items-center ${badge}`}>
        <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-7">{label}</p>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl leading-8 font-semibold">{String(count).padStart(2, '0')}</span>
          <span className="text-xs text-muted">This Week</span>
        </p>
      </div>
    </div>
  )
}

import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const boxClass =
  'flex h-[46px] items-center justify-between gap-3 rounded-[3.5px] border border-[#e6e6e6] bg-white pr-3 pl-5 text-xs'

const icon = <Search className="size-5 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />

export function SearchLink() {
  return (
    <Link to="/search" className={`${boxClass} text-black/60`}>
      Search for a task
      {icon}
    </Link>
  )
}

export default function SearchBar({ value, onChange, autoFocus }) {
  return (
    <label className={`${boxClass} focus-within:border-primary`}>
      <input
        type="search"
        enterKeyHint="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a task"
        aria-label="Search for a task"
        className="h-full min-w-0 flex-1 bg-transparent text-black/60 outline-none placeholder:text-black/60 [&::-webkit-search-cancel-button]:hidden"
      />
      {icon}
    </label>
  )
}

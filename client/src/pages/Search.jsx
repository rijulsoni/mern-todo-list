import { ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import TaskList from '../components/TaskList.jsx'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { useGoBack } from '../hooks/useGoBack.js'
import { useTasks } from '../hooks/useTasks.js'

const MIN_SEARCH_LENGTH = 3

export default function Search() {
  const goBack = useGoBack()
  const [searchParams, setSearchParams] = useSearchParams()

  const input = searchParams.get('q') ?? ''
  const setInput = (value) => setSearchParams(value ? { q: value } : {}, { replace: true })
  const trimmed = input.trim()
  const query = useDebouncedValue(trimmed)
  const results = useTasks(query.length >= MIN_SEARCH_LENGTH ? { search: query } : null)

  let content
  if (!trimmed) {
    content = <p className="py-6 text-sm text-muted">Search by title or description.</p>
  } else if (trimmed.length < MIN_SEARCH_LENGTH) {
    content = <p className="py-6 text-sm text-muted">Type at least {MIN_SEARCH_LENGTH} characters to search.</p>
  } else if (results.error) {
    content = <p className="py-6 text-sm text-red-600">{results.error.message}</p>
  } else if (results.loading || query !== trimmed) {
    content = <p className="py-6 text-sm text-muted">Searching…</p>
  } else {
    content = (
      <TaskList
        tasks={results.tasks}
        setTasks={results.setTasks}
        emptyMessage={`No tasks match "${query}".`}
      />
    )
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-page px-6 pt-[31px] pb-10 md:max-w-2xl lg:max-w-3xl lg:pt-10">
      <button type="button" onClick={goBack} aria-label="Go back" className="-m-2 block p-2">
        <ArrowLeft className="size-6 text-black" strokeWidth={2} />
      </button>

      <div className="mt-7.5">
        <SearchBar value={input} onChange={setInput} autoFocus />
      </div>

      <section className="mt-[22px]" aria-live="polite">
        {content}
      </section>
    </main>
  )
}

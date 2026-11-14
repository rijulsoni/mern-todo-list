import { ArrowLeft } from 'lucide-react'
import { useGoBack } from '../hooks/useGoBack.js'

export default function PageHeader({ title }) {
  const goBack = useGoBack()

  return (
    <header className="flex items-center gap-3">
      <button type="button" onClick={goBack} aria-label="Go back" className="-m-2 p-2">
        <ArrowLeft className="size-6 text-black" strokeWidth={2} />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}

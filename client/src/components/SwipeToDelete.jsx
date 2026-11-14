import { useRef, useState } from 'react'

const ACTION_WIDTH = 80
const DRAG_THRESHOLD = 8

export default function SwipeToDelete({ onDelete, children }) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const gesture = useRef(null)

  function handlePointerDown(e) {
    gesture.current = { startX: e.clientX, startOffset: offset, active: false }
  }

  function handlePointerMove(e) {
    const g = gesture.current
    if (!g) return

    const dx = e.clientX - g.startX
    if (!g.active) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      g.active = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setOffset(Math.min(0, Math.max(-ACTION_WIDTH, g.startOffset + dx)))
  }

  function handlePointerEnd() {
    if (!gesture.current) return
    gesture.current = null
    setDragging(false)
    setOffset((current) => (current < -ACTION_WIDTH / 2 ? -ACTION_WIDTH : 0))
  }

  const isOpen = offset !== 0

  return (
    <div className="overflow-hidden">
      <div
        className={`flex touch-pan-y select-none ${dragging ? '' : 'transition-transform duration-200'}`}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className="w-full shrink-0"
          onClickCapture={(e) => {
            if (isOpen) {
              e.preventDefault()
              e.stopPropagation()
              setOffset(0)
            }
          }}
        >
          {children}
        </div>
        <button
          type="button"
          onClick={onDelete}
          tabIndex={isOpen ? 0 : -1}
          aria-hidden={!isOpen}
          className="shrink-0 bg-red-500 text-sm font-medium text-white"
          style={{ width: ACTION_WIDTH }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragOverlay,
  DraggableSyntheticListeners,
  DropAnimation,
  useDndContext,
  useDraggable,
} from '@dnd-kit/core'
import { Move, MoveHorizontal, MoveVertical } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

enum Axis {
  All,
  Vertical,
  Horizontal,
}

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

function Story() {
  return (
    <DndContext>
      <div>
        <DraggableItem
          axis={Axis.All}
          label="Drag me to see the <DragOverlay>"
        />
      </div>
      <DraggableOverlay axis={Axis.All} />
    </DndContext>
  )
}

const Draggable = forwardRef<
  HTMLButtonElement,
  Partial<{
    listeners: DraggableSyntheticListeners
    dragging: boolean
    label: string
    axis: Axis
    style: React.CSSProperties
  }>
>(function Draggable(
  { listeners, dragging, label, axis, style, ...props },
  ref
) {
  return (
    <div className="flex flex-col space-y-2">
      <Button
        {...props}
        ref={ref}
        {...listeners}
        style={style}
        className={cn(
          'relative cursor-grab active:cursor-grabbing w-fit',
          dragging && 'scale-110 opacity-50'
        )}
      >
        {axis === Axis.All && <Move className="mr-2" />}
        {axis === Axis.Horizontal && <MoveHorizontal className="mr-2" />}
        {axis === Axis.Vertical && <MoveVertical className="mr-2" />}
        draggable
      </Button>
      {!dragging && <div>{label}</div>}
    </div>
  )
})

function DraggableItem({ axis, label }: { axis: Axis; label: string }) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: 'draggable-item',
  })

  return (
    <Draggable
      ref={setNodeRef}
      label={label}
      axis={axis}
      dragging={isDragging}
      listeners={listeners}
      style={{ opacity: isDragging ? 0.5 : undefined }}
    />
  )
}

function DraggableOverlay({
  axis,
  dropAnimation,
}: {
  axis: Axis
  dropAnimation?: DropAnimation
}) {
  const { active } = useDndContext()

  return createPortal(
    <DragOverlay dropAnimation={dropAnimation}>
      {active ? <Draggable axis={axis} dragging /> : null}
    </DragOverlay>,
    document.body
  )
}

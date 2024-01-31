'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragOverlay,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
  useDndContext,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { Expand, Move } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CSS } from '@dnd-kit/utilities'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

function Story() {
  const [isDragging, setIsDragging] = useState(false)
  const [parent, setParent] = useState<UniqueIdentifier | null>(null)

  const item = <DraggableItem />

  return (
    <DndContext
      onDragStart={() => {
        setIsDragging(true)
      }}
      onDragEnd={({ over }) => {
        setParent(over ? over.id : null)
        setIsDragging(false)
      }}
      onDragCancel={() => {
        setIsDragging(false)
      }}
    >
      <div className="flex flex-col space-y-4">
        <div className="bg-green-100">{parent === null ? item : null}</div>
        <div className="bg-slate-100 flex space-x-4">
          {['A', 'B', 'C'].map((id) => (
            <Droppable key={id} id={id} dragging={isDragging}>
              {parent === id ? item : null}
            </Droppable>
          ))}
        </div>
      </div>
      <DraggableOverlay />
    </DndContext>
  )
}

const Draggable = forwardRef<
  HTMLButtonElement,
  Partial<{
    listeners: DraggableSyntheticListeners
    dragging: boolean
    dragOverlay: boolean
    style: React.CSSProperties
  }>
>(function Draggable(
  { listeners, dragging, dragOverlay, style, ...props },
  ref
) {
  return (
    <Button
      {...props}
      ref={ref}
      {...listeners}
      style={style}
      className={cn(
        'relative cursor-grab active:cursor-grabbing',
        dragging && 'scale-110 opacity-50',
        dragOverlay && 'scale-110 opacity-50'
      )}
    >
      <Move className="mr-2" />
      draggable
    </Button>
  )
})

function DraggableItem() {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: 'draggable-item',
  })

  return (
    <Draggable
      listeners={listeners}
      dragging={isDragging}
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0 : undefined }}
    />
  )
}

function Droppable({
  children,
  id,
  dragging,
}: {
  children: React.ReactNode
  id: UniqueIdentifier
  dragging: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative bg-blue-100 border transition w-80 h-80 flex flex-col justify-center items-center space-y-4',
        children && 'border-yellow-500',
        dragging && 'border-green-500',
        isOver && 'border-red-500 shadow-xl'
      )}
    >
      {children}
      <div className={cn('flex transition', children && 'opacity-50 scale-75')}>
        <Expand className="mr-2" />
        Droppable
      </div>
    </div>
  )
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { transform: CSS.Transform.toString(transform.initial) },
      {
        transform: CSS.Transform.toString({
          ...transform.final,
          scaleX: 0.5,
          scaleY: 0.5,
        }),
      },
    ]
  },
  sideEffects({ active, dragOverlay }) {
    active.node.style.opacity = '0'

    const button = dragOverlay.node.querySelector('button')

    if (button) {
      button.animate(
        [
          {
            boxShadow:
              '-1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)',
          },
          {
            boxShadow:
              '-1px 0 15px 0 rgba(34, 33, 81, 0), 0px 15px 15px 0 rgba(34, 33, 81, 0)',
          },
        ],
        {
          duration: 250,
          easing: 'ease',
          fill: 'forwards',
        }
      )
    }

    return () => {
      active.node.style.opacity = ''
    }
  },
}

function DraggableOverlay() {
  const { active } = useDndContext()

  return createPortal(
    <DragOverlay dropAnimation={dropAnimationConfig}>
      {active ? <Draggable dragging dragOverlay /> : null}
    </DragOverlay>,
    document.body
  )
}

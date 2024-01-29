'use client'

import { Button } from '@/components/ui/button'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { GripVertical, Move } from 'lucide-react'
import { CSSProperties, useEffect, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { Coordinates } from '@dnd-kit/core/dist/types'
import { cn } from '@/lib/utils'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

function Story() {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 })
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          }
        })
      }}
    >
      <DraggableItem top={y} left={x} />
    </DndContext>
  )
}

function DraggableItem({ top, left }: { top: number; left: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: 'draggable',
    })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Button
      className={cn('relative cursor-auto', isDragging && 'shadow-xl')}
      ref={setNodeRef}
      style={{ ...style, top, left }}
      {...attributes}
      tabIndex={-1}
    >
      <Move className="mr-2" />
      draggable
      <GripVertical
        {...listeners}
        className="cursor-grab active:cursor-grabbing hover:opacity-50"
      />
    </Button>
  )
}

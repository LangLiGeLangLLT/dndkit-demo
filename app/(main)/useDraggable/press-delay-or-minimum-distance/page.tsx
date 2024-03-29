'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerActivationConstraint,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Coordinates } from '@dnd-kit/core/dist/types'
import { Move } from 'lucide-react'
import { CSSProperties, useEffect, useState } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

const activationConstraint: PointerActivationConstraint = {
  delay: 250,
  distance: 3,
  tolerance: 10,
}

function Story() {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint })
  const touchSensor = useSensor(TouchSensor, { activationConstraint })
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return { x: x + delta.x, y: y + delta.y }
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

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.06)`,
      }
    : undefined

  return (
    <Button
      className={cn(
        'relative cursor-grab active:cursor-grabbing',
        isDragging && 'shadow-xl'
      )}
      ref={setNodeRef}
      style={{ ...style, top, left }}
      {...listeners}
      {...attributes}
    >
      <Move className="mr-2" />
      draggable
    </Button>
  )
}

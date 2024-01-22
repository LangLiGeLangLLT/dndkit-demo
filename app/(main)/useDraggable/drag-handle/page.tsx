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
import { useEffect, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { Coordinates } from '@dnd-kit/core/dist/types'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Dnd />}</>
}

function Dnd() {
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
      <Wrapper>
        <Draggable top={y} left={x} />
      </Wrapper>
    </DndContext>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="h-96 bg-gray-200">{children}</div>
}

function Draggable({ top, left }: { top: number; left: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Button
      className="relative cursor-auto"
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

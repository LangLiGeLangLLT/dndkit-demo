'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  KeyboardSensor,
  Modifier,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Coordinates } from '@dnd-kit/core/dist/types'
import { Move, MoveVertical } from 'lucide-react'
import { CSSProperties, useEffect, useState } from 'react'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

enum Axis {
  All,
  Vertical,
  Horizontal,
}

const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  }
}

function Story() {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0,
  })
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
      modifiers={[restrictToVerticalAxis]}
    >
      <Wrapper>
        <DraggableItem top={y} left={x} axis={Axis.Vertical} />
      </Wrapper>
    </DndContext>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="h-96 bg-gray-200">{children}</div>
}

function DraggableItem({
  top,
  left,
  axis,
}: {
  top: number
  left: number
  axis: Axis
}) {
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
      {axis === Axis.Vertical ? (
        <MoveVertical className="mr-2" />
      ) : (
        <Move className="mr-2" />
      )}
      draggable
    </Button>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Coordinates } from '@dnd-kit/core/dist/types'
import { createSnapModifier } from '@dnd-kit/modifiers'
import { Move } from 'lucide-react'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import styles from './page.module.css'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
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

  const [gridSize, setGridSize] = useState(30)
  const buttonStyle: CSSProperties = {
    marginLeft: -4,
    marginTop: 4,
    width: gridSize * 8,
    height: gridSize * 2,
  }
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize])

  return (
    <>
      <DndContext
        key={gridSize}
        sensors={sensors}
        onDragEnd={({ delta }) => {
          setCoordinates(({ x, y }) => {
            return {
              x: x + delta.x,
              y: y + delta.y,
            }
          })
        }}
        modifiers={[snapToGrid]}
      >
        <Draggable top={y} left={x} buttonStyle={buttonStyle} />
      </DndContext>
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  )
}

function Grid({ size }: { size: number; onSizeChange(size: number): void }) {
  return (
    <div
      className={styles.Grid}
      style={{ '--grid-size': `${size}px` } as CSSProperties}
    />
  )
}

function Draggable({
  top,
  left,
  buttonStyle,
}: {
  top: number
  left: number
  buttonStyle: CSSProperties
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
      style={{ ...style, ...buttonStyle, top, left }}
      {...listeners}
      {...attributes}
    >
      <Move className="mr-2" />
      draggable
    </Button>
  )
}

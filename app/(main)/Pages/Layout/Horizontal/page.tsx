'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useDndContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { forwardRef, useEffect, useState } from 'react'
import { CSS, isKeyboardEvent } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <>{isClient && <Story />}</>
}

function Story() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [items, setItems] = useState<UniqueIdentifier[]>(() =>
    new Array(20).fill(0).map((_, index) => `item-${index + 1}`)
  )
  const activeIndex = activeId ? items.indexOf(activeId) : -1
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items}>
        <div className="space-y-4">
          {items.map((id, index) => (
            <SortableItem
              id={id}
              index={index + 1}
              key={id}
              activeIndex={activeIndex}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? <ItemOverlay id={activeId} items={items} /> : null}
      </DragOverlay>
    </DndContext>
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleDragEnd({ over }: DragEndEvent) {
    if (over) {
      const overIndex = items.indexOf(over.id)

      if (activeIndex !== overIndex) {
        const newIndex = overIndex

        setItems((items) => arrayMove(items, activeIndex, newIndex))
      }
    }

    setActiveId(null)
  }
}

function ItemOverlay({
  id,
  items,
  ...props
}: {
  id: UniqueIdentifier
  items: UniqueIdentifier[]
}) {
  const { activatorEvent, over } = useDndContext()
  const isKeyboardSorting = isKeyboardEvent(activatorEvent)
  const activeIndex = items.indexOf(id)
  const overIndex = over?.id ? items.indexOf(over.id) : -1

  return (
    <Item
      id={id}
      {...props}
      clone
      insertPosition={
        isKeyboardSorting && overIndex !== activeIndex
          ? overIndex > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
    />
  )
}

function SortableItem({
  id,
  activeIndex,
  ...props
}: {
  id: UniqueIdentifier
  activeIndex: number
  index: number
}) {
  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: () => true,
  })

  return (
    <Item
      ref={setNodeRef}
      id={id}
      active={isDragging}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
      }}
      insertPosition={
        over?.id === id
          ? index > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}

enum Position {
  Before = -1,
  After = 1,
}

const Item = forwardRef<
  HTMLDivElement,
  Partial<{
    active: boolean
    clone: boolean
    insertPosition: Position
    index: number
    id: UniqueIdentifier
    style: React.CSSProperties
  }>
>(function Item(
  { active, clone, insertPosition, index, id, style, ...props },
  ref
) {
  return (
    <Card
      ref={ref}
      data-id={id}
      {...props}
      style={style}
      className={cn(
        'relative cursor-grab after:absolute after:bg-blue-500 after:w-full',
        active && 'cursor-grabbing bg-slate-100',
        clone && 'cursor-grabbing text-red-100',
        insertPosition === Position.Before && 'after:-top-2.5 after:h-1',
        insertPosition === Position.After && 'after:-bottom-2.5 after:h-1'
      )}
    >
      <CardHeader>
        <CardTitle>{id}</CardTitle>
      </CardHeader>

      {index !== null ? <CardContent>{index}</CardContent> : null}
    </Card>
  )
})

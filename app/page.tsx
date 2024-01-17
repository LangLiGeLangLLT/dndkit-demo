import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Item = {
  title: string
  children?: Item[]
  href?: string
}

const items: Item[] = [
  {
    title: 'useDraggable',
    children: [
      {
        title: 'Basic Setup',
        href: '/useDraggable/basic-setup',
      },
    ],
  },
]

export default function Home() {
  return (
    <main className="container">
      <div className="py-4">
        <NavItems items={items} />
      </div>
    </main>
  )
}

function NavItems({ items }: { items: Item[] }) {
  return (
    <div className="-ml-4">
      {items.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </div>
  )
}

function NavItem({ item }: { item: Item }) {
  if (item.children) {
    return (
      <div className="ml-4">
        <h2 className="text-2xl">{item.title}</h2>
        <div>
          {item.children.map((v) => (
            <div key={v.title}>
              <NavItem item={v} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Button asChild variant="link" className="p-0">
      <Link href={item.href!}>{item.title}</Link>
    </Button>
  )
}

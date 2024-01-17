import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="mb-4">
        <Button asChild variant="link" className="p-0">
          <Link href="/">Back</Link>
        </Button>
      </div>
      <main>{children}</main>
    </div>
  )
}

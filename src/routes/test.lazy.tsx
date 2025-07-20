import { Card } from '@/components/ui/card'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex size-full">
      <Card className="p-4">
        hello
      </Card>
    </div>
  )
}

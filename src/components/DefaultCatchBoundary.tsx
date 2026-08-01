import { ErrorComponent, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function DefaultCatchBoundary({ error }: { error: Error }) {
  const router = useRouter()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
      <ErrorComponent error={error} />
      <Button onClick={() => router.invalidate()}>Try again</Button>
    </div>
  )
}

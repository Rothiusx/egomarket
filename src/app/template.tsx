import { AnimatedLayout } from '@/components/animated-layout'
import { LoaderCircle } from 'lucide-react'
import { Suspense } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-grow flex-col items-center justify-center">
          <LoaderCircle className="size-32 animate-spin text-slate-800 dark:text-slate-400" />
        </div>
      }
    >
      <AnimatedLayout>{children}</AnimatedLayout>
    </Suspense>
  )
}

import { LoaderCircle } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <LoaderCircle className="size-32 animate-spin text-slate-800 dark:text-slate-400" />
    </div>
  )
}

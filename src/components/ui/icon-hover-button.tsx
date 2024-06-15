import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface IconHoverButtonProps extends ButtonProps {
  icon: React.ReactNode
}

const IconHoverButton = forwardRef<HTMLButtonElement, IconHoverButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <Button
        className={cn(
          'group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500',
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="absolute -end-full transition-all group-hover:end-4">
          {icon}
        </span>
        <span className="flex items-center gap-2 transition-all group-hover:me-4">
          {props.children}
        </span>
      </Button>
    )
  }
)
IconHoverButton.displayName = 'IconHoverButton'

export { IconHoverButton }

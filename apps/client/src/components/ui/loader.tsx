import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loader({ size = "md", text, className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn("animate-spin rounded-full border-primary border-t-transparent", sizeClasses[size])}
        role="status"
        aria-label="読み込み中"
      />
      {text && <p className={cn("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
    </div>
  )
}
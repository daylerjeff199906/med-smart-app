import { Skeleton } from "@/components/ui/skeleton"

export default function ProtectedLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

import { Skeleton } from "@ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 min-w-0">
      <div className="flex items-start gap-3 mt-2 min-w-0">
        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />

        <div className="space-y-2 min-w-0 flex-1">
          <Skeleton className="h-6 w-full max-w-[18rem] sm:max-w-xs" />
          <Skeleton className="h-4 w-full max-w-[10rem] sm:max-w-[12rem]" />
        </div>
      </div>

      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-3 min-w-0">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <Skeleton className="h-24 sm:h-32 w-full" />
          <Skeleton className="h-52 sm:h-64 w-full" />
        </div>

        <div className="space-y-6 min-w-0">
          <Skeleton className="h-52 sm:h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

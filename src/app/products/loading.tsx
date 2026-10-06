import { Skeleton } from "@/components/ui";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="h-4 w-72" />
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 space-y-4">
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-10 flex-1" />
            <Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
          </div>

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-t border-zinc-100 dark:border-zinc-800"
            >
              <Skeleton
                variant="rectangular"
                className="h-12 w-12 rounded-lg shrink-0"
              />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-1/3" />
                <Skeleton variant="text" className="h-3 w-1/4" />
              </div>
              <Skeleton
                variant="rectangular"
                className="h-6 w-20 rounded-full"
              />
              <Skeleton variant="text" className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

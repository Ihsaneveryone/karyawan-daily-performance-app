import { Skeleton } from './skeleton';
import { Card, CardContent } from './card';

// Skeleton loading mirip YouTube - smooth dan natural
export function IndicatorSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon skeleton */}
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              
              <div className="flex-1 space-y-3">
                {/* Title skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                
                {/* Input skeleton */}
                <Skeleton className="h-10 w-full max-w-xs" />
                
                {/* Photo buttons skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
              
              {/* Score skeleton */}
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-6 w-16 ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton untuk card dashboard
export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton untuk tabel/list
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          {[1, 2, 3, 4, 5].map((j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton untuk history/timeline
export function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* PR Info Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      </Card>

      {/* Summary Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>

      {/* Score Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded" />
            <Skeleton className="h-3 flex-1 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>

      {/* Issues Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionsPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="rounded-md border">
        <div className="w-full">
          <div className="flex border-b">
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex border-b">
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

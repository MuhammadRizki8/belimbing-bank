'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-md border">
        {/* Table Skeleton */}
        <div className="w-full">
          {/* Header */}
          <div className="flex border-b">
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 w-32 text-right">
              <Skeleton className="h-5 w-16 ml-auto" />
            </div>
          </div>
          {/* Rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex border-b">
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-4 w-32 text-right">
                <Skeleton className="h-8 w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

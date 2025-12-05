'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AccountDetailsPageSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-10">
        <CardHeader>
          <Skeleton className="h-8 w-56" />
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-md border">
            {/* Header */}
            <div className="flex border-b">
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            {/* Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center border-b">
                <div className="p-4 flex-1">
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="p-4 flex-1">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="p-4 flex-1">
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

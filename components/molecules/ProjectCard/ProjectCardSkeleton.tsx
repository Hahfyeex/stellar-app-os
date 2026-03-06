import * as React from 'react';
import { Skeleton, SkeletonText } from '@/components/atoms/Skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/molecules/Card';

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-muted">
      {/* Image Area Skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="absolute inset-0 rounded-none" />
        {/* Badge Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      <CardHeader className="p-5 pb-3 flex-none space-y-2">
        {/* Location Skeleton */}
        <div className="flex items-center space-x-2 mb-1">
          <Skeleton variant="circle" className="h-3.5 w-3.5 shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>

      <CardContent className="p-5 pt-0 grow flex flex-col justify-between space-y-4">
        {/* Description Skeleton (2 lines) */}
        <SkeletonText lines={2} />

        {/* Progress Area Skeleton */}
        <div className="space-y-2 mt-auto pt-4">
          <div className="flex justify-between items-end">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>

          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-4 border-t bg-muted/10 flex items-center justify-between flex-none gap-3">
        {/* Price Skeleton */}
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full sm:w-28 rounded-md" />
      </CardFooter>
    </Card>
  );
}

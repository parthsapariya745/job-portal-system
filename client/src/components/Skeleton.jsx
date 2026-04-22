import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge("animate-pulse rounded-md bg-gray-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className }) => (
  <div className={twMerge("bg-white dark:bg-slate-900/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800", className)}>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="mt-6 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="mt-6 flex justify-between items-center">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const SkeletonStat = () => (
  <div className="bg-white dark:bg-slate-900/50 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-800">
    <div className="flex items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="ml-4 space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg">
    <div className="flex items-center space-x-4 flex-1">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
  </div>
);

export default Skeleton;


import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/50 rounded-2xl ${className}`}>
    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
  </div>
);

export const PostSkeleton = () => (
  <div className="glass-card rounded-[3.5rem] border-white/5 overflow-hidden p-8 space-y-6">
    <div className="flex items-center gap-5">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-2" />
      </div>
    </div>
    <Skeleton className="w-full h-64 rounded-3xl" />
    <div className="space-y-3">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="glass-card rounded-[2.5rem] overflow-hidden p-4 space-y-4">
    <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
    <div className="px-4 pb-4 space-y-3">
      <Skeleton className="w-1/2 h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  </div>
);

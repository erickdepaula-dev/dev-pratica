import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Bloco de carregamento com brilho deslizante (estático com prefers-reduced-motion). */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton rounded-control bg-surface-hover ${className}`} aria-hidden="true" />
);

/** Esqueleto de página exibido enquanto o progresso é carregado do Firestore. */
export const PageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Sincronizando progresso com o Firebase"
    className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6"
  >
    <span className="sr-only">Sincronizando progresso com o Firebase…</span>

    <div className="space-y-2 pb-2 border-b border-subtle">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-3 w-80 max-w-full" />
    </div>

    <div className="rounded-card border border-subtle bg-surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
      <Skeleton className="w-24 h-24 rounded-full shrink-0" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-11 w-full sm:w-40" />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-card border border-subtle bg-surface p-4 space-y-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      ))}
    </div>

    <div className="rounded-card border border-subtle bg-surface p-5 space-y-4">
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

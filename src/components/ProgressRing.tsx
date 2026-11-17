import React, { useId } from 'react';
import { motion } from 'motion/react';

interface ProgressRingProps {
  /** Percentual de 0 a 100. */
  percent: number;
  /** Diâmetro em px. */
  size?: number;
  strokeWidth?: number;
  /** Conteúdo central; por padrão mostra o percentual. */
  children?: React.ReactNode;
  label?: string;
}

/** Anel de progresso com o gradiente assinatura (tokens `--accent-from` → `--accent-to`). */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  size = 96,
  strokeWidth = 8,
  children,
  label = 'Progresso',
}) => {
  const gradientId = useId();
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--accent-from)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent-to)' }} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-subtle"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span className="text-lg font-black text-primary font-mono tabular-nums">{Math.round(clamped)}%</span>
        )}
      </div>
    </div>
  );
};

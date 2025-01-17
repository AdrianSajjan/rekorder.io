import { cn } from '@rekorder.io/utils';

interface CircularProgressProps {
  progress: number;

  size?: number;
  strokeWidth?: number;

  className?: string;
  trackClassName?: string;
  progressClassName?: string;
}

export function CircularProgress({ progress, size = 24, strokeWidth = 3, className, trackClassName, progressClassName }: CircularProgressProps) {
  const viewBox = `0 0 ${size} ${size}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} viewBox={viewBox} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} className={cn('stroke-background-dark', trackClassName)} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn('stroke-primary-main transition-all ease-linear', progressClassName)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

'use client';

interface ChevronLeftIconProps {
  className?: string;
}

export function ChevronLeftIcon({ className = 'h-4 w-4' }: ChevronLeftIconProps): JSX.Element {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

interface ChevronRightIconProps {
  className?: string;
}

export function ChevronRightIcon({ className = 'h-4 w-4' }: ChevronRightIconProps): JSX.Element {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

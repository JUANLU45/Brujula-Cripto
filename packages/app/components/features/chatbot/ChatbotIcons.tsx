'use client';

export const MenuIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const CloseIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const UserIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const CrownIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 17l3-10 4 4 4-4 3 10H3zm2-2h14l-2-6-3 3-4-4-3 3-2 6z" />
  </svg>
);

export const ShieldIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
  </svg>
);

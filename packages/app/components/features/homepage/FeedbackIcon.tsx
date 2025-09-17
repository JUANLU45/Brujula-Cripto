import Image from 'next/image';

interface FeedbackIconProps {
  customIcon?: string;
}

export function FeedbackIcon({ customIcon }: FeedbackIconProps): JSX.Element {
  if (customIcon) {
    return (
      <Image
        src={customIcon}
        alt="Feedback icon"
        width={24}
        height={24}
        className="h-full w-full"
      />
    );
  }

  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9a9 9 0 00-9 9m9-9v9m0-9a9 9 0 919 9M3 12a9 9 0 009 9"
      />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

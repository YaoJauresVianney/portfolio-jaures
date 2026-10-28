// Glyphs drawn specifically for the mockup (no faithful lucide equivalent). Stroke icons share lucide's 24px grid.
type IconProps = { className?: string };

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x="0" y="0" width="14" height="14" rx="2" className="fill-terra" />
      <rect x="18" y="0" width="14" height="14" rx="2" className="fill-ocre" />
      <rect x="0" y="18" width="14" height="14" rx="2" className="fill-green" />
      <rect x="18" y="18" width="14" height="14" rx="2" className="fill-terra" />
    </svg>
  );
}

/** Speech bubble; `handset` adds the phone of the desktop contact button. */
export function WhatsAppIcon({ className, handset }: IconProps & { handset?: boolean }) {
  return (
    <svg {...stroke} className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z" />
      {handset && (
        <path
          className="max-lg:hidden"
          d="M9 9.5c.3 1.9 1.6 3.3 3.5 4l1-1 2 1c-.2 1-1 1.6-2 1.5-3-.3-5.3-2.6-5.6-5.6-.1-1 .5-1.8 1.5-2l1 2z"
        />
      )}
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function CodeIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 11h6M9 15h4" />
    </svg>
  );
}

export function NetworkIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8 7.5l2.8 8M16 7.5l-2.8 8M8.5 6h7" />
    </svg>
  );
}

export function ArrowLong({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M1 7h36M31 1l6 6-6 6" />
    </svg>
  );
}

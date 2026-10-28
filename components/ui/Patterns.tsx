import type { CSSProperties } from 'react';

// Ivorian motifs, defined once. pf-* = desktop tiles, pm-* = phone tiles (copied from the references).
export function PatternDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <pattern id="pf-kita" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect x="0" y="6" width="44" height="6" fill="currentColor" />
          <rect x="0" y="20" width="44" height="6" style={{ fill: 'var(--ocre)' }} />
          <rect x="0" y="34" width="44" height="6" fill="currentColor" />
          <polygon points="52,42 72,8 92,42" style={{ fill: 'var(--green)' }} />
          <rect x="6" y="52" width="6" height="40" style={{ fill: 'var(--ocre)' }} />
          <rect x="20" y="52" width="6" height="40" fill="currentColor" />
          <rect x="34" y="52" width="6" height="40" style={{ fill: 'var(--ocre)' }} />
          <rect x="52" y="52" width="18" height="18" fill="currentColor" />
          <rect x="74" y="74" width="18" height="18" style={{ fill: 'var(--green)' }} />
        </pattern>
        <pattern id="pf-losange" width="44" height="44" patternUnits="userSpaceOnUse">
          <polygon points="22,4 40,22 22,40 4,22" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="22,16 28,22 22,28 16,22" fill="currentColor" />
        </pattern>
        <pattern id="pf-zigzag" width="28" height="20" patternUnits="userSpaceOnUse">
          <polyline points="0,16 7,4 14,16 21,4 28,16" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </pattern>
        <pattern id="pm-kita" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect x="0" y="4" width="33" height="5" fill="currentColor" />
          <rect x="0" y="15" width="33" height="5" style={{ fill: 'var(--ocre)' }} />
          <rect x="0" y="26" width="33" height="5" fill="currentColor" />
          <polygon points="39,32 54,6 69,32" style={{ fill: 'var(--green)' }} />
          <rect x="4" y="39" width="5" height="30" style={{ fill: 'var(--ocre)' }} />
          <rect x="15" y="39" width="5" height="30" fill="currentColor" />
          <rect x="26" y="39" width="5" height="30" style={{ fill: 'var(--ocre)' }} />
          <rect x="39" y="39" width="14" height="14" fill="currentColor" />
          <rect x="56" y="56" width="14" height="14" style={{ fill: 'var(--green)' }} />
        </pattern>
        <pattern id="pm-losange" width="36" height="36" patternUnits="userSpaceOnUse">
          <polygon points="18,3 33,18 18,33 3,18" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="18,13 23,18 18,23 13,18" fill="currentColor" />
        </pattern>
        <pattern id="pm-zigzag" width="24" height="16" patternUnits="userSpaceOnUse">
          <polyline points="0,13 6,3 12,13 18,3 24,13" fill="none" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
}

const FILL = {
  kita: 'fill-[url(#pm-kita)] lg:fill-[url(#pf-kita)]',
  losange: 'fill-[url(#pm-losange)] lg:fill-[url(#pf-losange)]',
  zigzag: 'fill-[url(#pm-zigzag)] lg:fill-[url(#pf-zigzag)]',
};

type PatternProps = { kind: keyof typeof FILL; className?: string; style?: CSSProperties } & Record<
  `data-${string}`,
  string
>;

/** A decorative surface filled with one of the motifs. */
export function Pattern({ kind, className, style, ...data }: PatternProps) {
  return (
    <svg aria-hidden="true" className={className} style={style} {...data}>
      <rect width="100%" height="100%" className={FILL[kind]} />
    </svg>
  );
}

'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun } from 'lucide-react';
import { site } from '@/content/site';
import { MoonIcon } from '@/components/ui/Icons';

const MOBILE = '(max-width: 1023px)';
const noop = () => () => {};

/** Effective theme: "auto" (no choice stored yet) means dark on a phone, light on a computer. */
function isDark(theme: string | undefined) {
  return theme === 'dark' || (theme === 'auto' && matchMedia(MOBILE).matches);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const { generic, toLight, toDark } = site.nav.theme;
  const label = mounted ? (isDark(theme) ? toLight : toDark) : generic;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(isDark(theme) ? 'light' : 'dark')}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink"
    >
      {/* Both icons are rendered; CSS picks one so the server HTML is right before hydration. */}
      <Sun aria-hidden className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </button>
  );
}

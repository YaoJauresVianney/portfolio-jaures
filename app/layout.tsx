import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { site } from '@/content/site';
import '@/styles/globals.css';

// Variable fonts: one file each covers every weight used (Fraunces 400/600/700, Manrope 400–700).
// No italic file: like the reference, the hero accent uses the browser's synthesized italic.
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
};

// Runs before the first paint: switches to the film layout unless the visitor prefers reduced motion,
// so nothing jumps when the film starts. If the film has not started 4 s after load (script error,
// very old browser), the static layout comes back.
const FILM_BOOT = `(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.dataset.film='on';addEventListener('load',function(){setTimeout(function(){if(d.dataset.film!=='ready')delete d.dataset.film},4000)})})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: FILM_BOOT }} />
        {/* No stored choice → data-theme="auto": light on a computer, dark on a phone (see globals.css). */}
        <ThemeProvider attribute="data-theme" defaultTheme="auto" enableSystem={false} enableColorScheme={false}>
          {/* Smooth scrolling (off for touch and reduced motion); FilmProvider drives its frames. */}
          <ReactLenis root options={{ autoRaf: false }}>
            {children}
          </ReactLenis>
        </ThemeProvider>
      </body>
    </html>
  );
}

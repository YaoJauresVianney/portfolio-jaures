import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {/* No stored choice → data-theme="auto": light on a computer, dark on a phone (see globals.css). */}
        <ThemeProvider attribute="data-theme" defaultTheme="auto" enableSystem={false} enableColorScheme={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

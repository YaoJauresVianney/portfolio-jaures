import { site } from '@/content/site';
import { Nav } from '@/components/layout/Nav';
import { PatternDefs } from '@/components/ui/Patterns';
import { Hero } from '@/components/scenes/Hero';
import { Cases } from '@/components/scenes/Cases';
import { Services } from '@/components/scenes/Services';
import { Stack } from '@/components/scenes/Stack';
import { Method } from '@/components/scenes/Method';
import { Contact } from '@/components/scenes/Contact';

export default function Home() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-terra focus:px-5 focus:py-3 focus:font-bold focus:text-terra-ink"
      >
        {site.nav.skip}
      </a>
      <PatternDefs />
      <Nav />
      <main id="contenu" tabIndex={-1} className="outline-none">
        <Hero />
        <Cases />
        <Services />
        <Stack />
        <Method />
        <Contact />
      </main>
    </>
  );
}

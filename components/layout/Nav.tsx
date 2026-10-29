import { site, WHATSAPP_URL } from '@/content/site';
import { LogoMark } from '@/components/ui/Icons';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const { label, links, cta } = site.nav;
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line bg-nav-bg backdrop-blur-[10px] lg:h-[88px]">
      <div className="mx-auto flex h-full items-center justify-between px-5 max-lg:max-w-[440px] lg:px-(--pad-x)">
        <a href="#top" className="flex min-h-11 items-center gap-2.5 text-ink no-underline hover:text-terra lg:gap-3">
          <LogoMark className="size-[26px] lg:size-8" />
          <span className="font-serif text-[22px] font-bold lg:text-[26px] lg:tracking-[-0.01em]">{site.name}</span>
        </a>
        <nav aria-label={label} className="hidden items-center gap-9 text-base font-semibold lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="-mx-1 -my-[11px] px-1 py-[11px] text-ink no-underline hover:text-terra"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <a
            href={WHATSAPP_URL}
            className="btn hidden h-11 items-center rounded-full bg-terra px-[22px] text-[15px] font-bold text-terra-ink lg:flex"
          >
            {cta}
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

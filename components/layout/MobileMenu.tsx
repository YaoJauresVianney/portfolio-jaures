'use client';

import { useEffect, useRef, useState } from 'react';
import { site, WHATSAPP_URL } from '@/content/site';
import { MenuIcon, WhatsAppIcon } from '@/components/ui/Icons';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const { label, links, cta, menu } = site.nav;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={open ? menu.close : menu.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink text-bg lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>
      <nav
        ref={panel}
        id="mobile-menu"
        aria-label={label}
        hidden={!open}
        // Any link closes the menu (the anchor scroll happens natively).
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
        className="absolute inset-x-0 top-16 border-b border-line bg-bg px-5 pt-3 pb-6 shadow-[0_20px_40px_rgba(20,14,8,0.18)] lg:hidden"
      >
        <div className="mx-auto flex max-w-[400px] flex-col">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`py-3 font-serif text-[22px] font-semibold text-ink no-underline ${i < links.length - 1 ? 'border-b border-line' : ''}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            className="btn mt-4 flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-terra text-base font-bold text-terra-ink"
          >
            <WhatsAppIcon className="size-5" />
            {cta}
          </a>
        </div>
      </nav>
    </>
  );
}

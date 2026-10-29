import { site, WHATSAPP_URL } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';
import { PhotoDiorama } from '@/components/ui/PhotoDiorama';
import { WhatsAppIcon } from '@/components/ui/Icons';

const BADGE_COLORS = ['bg-terra', 'bg-ocre', 'bg-green'];

export function Hero() {
  const h = site.hero;
  return (
    <section id="top" data-scene="hero" aria-labelledby="hero-title" className="sc sc-hero">
      <div className="stage bg-bg">
        <Pattern
          kind="losange"
          className="pat inset-0 h-[120%] w-full text-terra lg:inset-auto lg:top-0 lg:right-0 lg:w-[640px]"
        />
        <div className="stage-in flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
          {/* On a phone the text column dissolves so the photo can sit above it. */}
          <div className="flex flex-col gap-[clamp(14px,2.6vh,28px)] max-lg:contents lg:flex-1">
            <div data-fx="left" data-intro="0" className="eyebrow flex items-center gap-2.5 text-ocre-ink lg:gap-3">
              <span aria-hidden="true" className="h-[3px] w-[22px] shrink-0 rounded-xs bg-ocre lg:w-8" />
              <span className="lg:hidden">{h.eyebrow.mobile}</span>
              <span className="max-lg:hidden">{h.eyebrow.desktop}</span>
            </div>
            <h1
              id="hero-title"
              data-fx="blur"
              data-intro="150"
              className="m-0 font-serif text-[length:clamp(30px,9.4cqw,40px)] leading-[1.06] font-semibold tracking-[-0.02em] lg:text-[length:clamp(44px,min(5vw,7.6vh),72px)] lg:leading-[1.04] lg:tracking-[-0.025em]"
            >
              {h.title.lead}
              <span className="text-terra italic">{h.title.accent}</span>
            </h1>
            <p
              data-fx="drop"
              data-intro="400"
              className="m-0 text-base leading-[1.55] text-muted lg:max-w-[620px] lg:text-[length:clamp(16px,2.3vh,20px)] lg:leading-[1.6]"
            >
              {h.intro}
            </p>
            <div
              data-fx="zoom"
              data-intro="600"
              className="flex flex-col gap-2.5 pt-1 lg:origin-left lg:flex-row lg:flex-wrap lg:items-center lg:gap-4 lg:pt-2"
            >
              <a
                href={WHATSAPP_URL}
                className="btn flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-terra text-base font-bold text-terra-ink lg:h-14 lg:px-7 lg:text-[17px]"
              >
                <WhatsAppIcon className="size-5" />
                {h.ctaPrimary}
              </a>
              <a
                href="#cas"
                className="btn box-content flex h-12 items-center justify-center rounded-full border-[1.5px] border-ink text-base font-bold text-ink lg:h-14 lg:px-[26px] lg:text-[17px]"
              >
                {h.ctaSecondary}
              </a>
            </div>
            <ul
              data-fx="wipe"
              data-intro="800"
              className="m-0 flex list-none flex-wrap gap-x-[18px] gap-y-1.5 p-0 text-[13px] font-semibold text-muted lg:gap-x-7 lg:gap-y-2 lg:pt-2 lg:text-sm"
            >
              {h.badges.map((b, i) => (
                <li key={b} className="flex items-center gap-[7px] lg:gap-2">
                  <span aria-hidden="true" className={`diamond size-[7px] lg:size-2 ${BADGE_COLORS[i]}`} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <PhotoDiorama />
        </div>
        <div
          aria-hidden="true"
          data-fx="fade"
          data-intro="1400"
          data-at="0 0.15"
          data-rev=""
          className="scroll-hint eyebrow absolute bottom-7 left-1/2 z-[2] -ml-[60px] w-[120px] flex-col items-center gap-2.5 text-muted"
        >
          {h.scrollHint}
          <span className="h-9 w-0.5 rounded-xs bg-terra" />
        </div>
      </div>
    </section>
  );
}

import { site } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';
import { CaseCard } from '@/components/ui/CaseCard';
import { ArrowLong } from '@/components/ui/Icons';

export function Cases() {
  const c = site.cases;
  return (
    <section id="cas" data-scene="cases" aria-labelledby="cas-title" className="sc sc-cases">
      <div className="stage bg-bg">
        <Pattern kind="kita" className="pat inset-0 h-[120%] w-full text-green" />
        <div className="stage-in">
          <div className="track flex flex-col gap-4 lg:gap-6" data-track="">
            <div className="case-intro flex flex-col gap-3.5 lg:gap-5">
              <div data-fx="left" data-src="e" data-at="0.5 0.85" className="eyebrow text-ocre-ink">
                {c.eyebrow}
              </div>
              <h2 id="cas-title" data-fx="mask" data-src="e" data-at="0.6 1" className="h2 lg:leading-[1.08]">
                {c.title}
              </h2>
              <p
                data-fx="fade"
                data-src="e"
                data-at="0.75 1"
                className="m-0 text-base leading-[1.55] text-muted lg:text-lg lg:leading-[1.6]"
              >
                {c.intro}
              </p>
              <div
                data-fx="curtain"
                data-src="e"
                data-at="0.85 1"
                className="flex items-center gap-2.5 text-sm font-bold text-terra-strong lg:gap-3"
              >
                {c.hint}
                <ArrowLong className="h-3.5 w-9 lg:w-10" />
              </div>
            </div>
            {c.items.map((item, i) => (
              <CaseCard key={item.num} item={item} index={i} />
            ))}
          </div>
        </div>
        <div className="cases-bar" aria-hidden="true">
          <div />
        </div>
        <div className="cube-shade" aria-hidden="true" />
      </div>
    </section>
  );
}

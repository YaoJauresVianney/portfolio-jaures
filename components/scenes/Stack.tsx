import { site } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';
import { SplitFlap } from '@/components/ui/SplitFlap';

// Each panel flips 0.06 after the previous one (reference: 0.3–0.5, 0.36–0.56 …); its caption follows.
const win = (start: number, i: number, len: number) =>
  `${+(start + 0.06 * i).toFixed(2)} ${+(start + len + 0.06 * i).toFixed(2)}`;

export function Stack() {
  const s = site.stack;
  return (
    <section id="stack" data-scene="stack" aria-labelledby="stack-title" className="sc sc-stack">
      <div className="stage bg-bg">
        <Pattern kind="zigzag" className="pat inset-0 h-[120%] w-full text-ocre" />
        <div className="stage-in flex flex-col gap-[22px] lg:gap-11">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between lg:gap-10 xl:gap-16">
            <div className="flex flex-col gap-2.5 lg:gap-4">
              <div data-fx="wipe" data-at="0 0.15" className="eyebrow text-ocre-ink">
                {s.eyebrow}
              </div>
              <h2 id="stack-title" data-fx="mask" data-at="0.05 0.3" className="h2 lg:leading-[1.05]">
                {s.title}
              </h2>
            </div>
            <p
              data-fx="fade"
              data-at="0.2 0.4"
              className="m-0 text-base leading-[1.55] text-muted lg:max-w-[300px] lg:text-lg xl:max-w-[380px] lg:leading-[1.6]"
            >
              {s.intro}
            </p>
          </div>
          <div>
            <div aria-hidden="true" data-fx="draw" data-at="0.25 0.5" className="mb-3.5 h-0.5 bg-ink lg:mb-0" />
            <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-2.5 p-0 lg:grid-cols-3 lg:gap-0">
              {s.items.map((t, i) => (
                <li
                  key={t.name}
                  className={`flex flex-col gap-2 overflow-hidden px-0.5 pt-1 pb-2 lg:gap-3 lg:border-b lg:border-line lg:py-7 lg:pr-6 ${i % 3 === 0 ? 'lg:pl-0' : 'lg:pl-8'} ${i % 3 !== 2 ? 'lg:border-r' : ''}`}
                >
                  <SplitFlap name={t.name} scramble={t.scramble} at={win(0.3, i, 0.2)} />
                  <div data-fx="fade" data-at={win(0.5, i, 0.1)} className="text-[13px] text-muted lg:text-sm">
                    {t.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="cube-shade" aria-hidden="true" />
      </div>
    </section>
  );
}

import { site } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';

const DOT = ['bg-[#E07A4F]', 'bg-[#E3A93A]', 'bg-[#F6EFE4]', 'bg-[#E3A93A]', 'bg-[#E07A4F]'];
// Each step stands up when the gold line reaches it: [desktop, phone] windows.
const DOMINO = [
  ['0.15 0.25', '0.12 0.2'],
  ['0.34 0.44', '0.32 0.4'],
  ['0.53 0.63', '0.52 0.6'],
  ['0.72 0.82', '0.72 0.8'],
  ['0.91 1', '0.9 0.98'],
];
// Phone only: the vertical line segment below each step.
const LINE_M = ['0.2 0.32', '0.4 0.52', '0.6 0.72', '0.8 0.9'];
const TRACK = 'bg-[rgba(246,239,228,0.18)]';
const LINE_X = 'absolute top-[27px] left-7 right-[calc((100%_-_96px)/5_-_28px)] hidden h-0.5 lg:block';
const LINE_Y = 'absolute top-11 -bottom-[22px] left-[21px] w-0.5 lg:hidden';

export function Method() {
  const m = site.method;
  return (
    <section id="methode" data-scene="method" aria-labelledby="methode-title" className="sc sc-method">
      <div className="stage bg-method-bg text-on-dark">
        <Pattern kind="kita" className="pat inset-0 h-[120%] w-full text-[#F6EFE4] opacity-[0.07]" />
        <div className="stage-in flex flex-col gap-7 lg:gap-16">
          <div className="flex max-w-[760px] flex-col gap-2.5 lg:gap-4">
            <div data-fx="fade" data-src="e" data-at="0.6 0.85" className="eyebrow text-[#E3A93A]">
              {m.eyebrow}
            </div>
            <h2 id="methode-title" data-fx="swing" data-src="e" data-at="0.65 1" className="h2 lg:leading-[1.08]">
              {m.title}
            </h2>
          </div>
          <div className="road relative lg:mr-[min(0px,56px_-_var(--pad-x))]">
            {/* Desktop: one horizontal line from the first circle to the last. */}
            <div aria-hidden="true" className={`${LINE_X} ${TRACK}`} />
            <div
              aria-hidden="true"
              data-fx="draw"
              data-ease="linear"
              data-at="0.15 0.92"
              className={`${LINE_X} bg-[#E3A93A]`}
            />
            <ol className="m-0 flex list-none flex-col gap-[22px] p-0 lg:grid lg:grid-cols-5 lg:grid-rows-[auto_auto_auto] lg:gap-x-6 lg:gap-y-[18px]">
              {m.steps.map((step, i) => (
                <li key={step.title} className="relative lg:row-span-3 lg:grid lg:grid-rows-subgrid">
                  {i < LINE_M.length && (
                    <>
                      <div aria-hidden="true" className={`${LINE_Y} ${TRACK}`} />
                      <div
                        aria-hidden="true"
                        data-fx="drawY"
                        data-ease="linear"
                        data-at={LINE_M[i]}
                        className={`${LINE_Y} bg-[#E3A93A]`}
                      />
                    </>
                  )}
                  <div
                    data-fx="domino"
                    data-ease="back"
                    data-at={DOMINO[i][0]}
                    data-at-m={DOMINO[i][1]}
                    className="relative flex max-lg:gap-4 lg:row-span-3 lg:grid lg:grid-rows-subgrid"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full font-serif text-[17px] font-semibold text-[#15110D] lg:size-14 lg:text-xl ${DOT[i]}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col gap-1 pt-[9px] lg:contents">
                      <h3 className="m-0 font-serif text-xl leading-[1.2] font-semibold xl:text-2xl">{step.title}</h3>
                      <p className="m-0 text-[15px] leading-[1.55] text-on-dark-muted lg:text-base lg:leading-[1.6]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="cube-shade" aria-hidden="true" />
      </div>
    </section>
  );
}

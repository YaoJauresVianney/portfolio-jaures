import { site, type CaseStudy } from '@/content/site';

// Reveal effect of each card element (reference data-fx), in slot order:
// number, title, subtitle, tags, problem, solution, result, key figure.
const CARD_FX = [
  ['pop', 'mask', 'wipe', 'curtain', 'left', 'rise', 'right', 'zoom'],
  ['spin', 'blur', 'fade', 'wipe', 'swing', 'zoom', 'flip', 'pop'],
  ['drop', 'wipe', 'rise', 'zoom', 'tilt', 'mask', 'blur', 'curtain'],
  ['zoom', 'swing', 'curtain', 'rise', 'drop', 'curtain', 'spin', 'iris'],
];
// Same windows for every card, read on the card's horizontal position (data-axis="x").
const WINDOWS = ['0.3 0.6', '0.35 0.65', '0.45 0.75', '0.5 0.8', '0.55 0.8', '0.62 0.88', '0.7 0.95', '0.8 1'];

function fx(card: number, slot: number) {
  const name = CARD_FX[card][slot];
  // Desktop pops bounce ("back"); the phone reference uses the default ease.
  const ease = name === 'pop' ? { 'data-ease': 'back', 'data-ease-m': 'out' } : {};
  return { 'data-fx': name, 'data-axis': 'x', 'data-at': WINDOWS[slot], ...ease };
}

export function CaseCard({ item, index }: { item: CaseStudy; index: number }) {
  const { labels } = site.cases;
  const blocks = [
    { label: labels.problem, text: item.problem, color: 'text-terra' },
    { label: labels.solution, text: item.solution, color: 'text-ocre-ink' },
    { label: labels.result, text: item.result, color: 'text-green-text' },
  ];
  return (
    <article className="case flex flex-col gap-[11px] rounded-[20px] border border-line bg-surface p-[18px] lg:gap-8 lg:rounded-[28px] lg:p-10">
      <div className="flex flex-col gap-[11px] lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex items-baseline gap-3 lg:gap-[18px]">
          <span
            {...fx(index, 0)}
            className="inline-block font-serif text-[28px] leading-none font-normal text-muted lg:text-[40px]"
          >
            {item.num}
          </span>
          <div className="flex flex-col gap-0.5 lg:gap-1.5">
            <h3
              {...fx(index, 1)}
              className="m-0 font-serif text-2xl leading-[1.15] font-semibold tracking-[-0.01em] lg:text-[32px] lg:leading-[1.2]"
            >
              {item.name}
            </h3>
            <div {...fx(index, 2)} className="text-[13px] font-semibold text-muted lg:text-sm">
              {item.subtitle}
            </div>
          </div>
        </div>
        <ul
          {...fx(index, 3)}
          className="m-0 flex list-none flex-wrap gap-1.5 p-0 lg:max-w-[360px] lg:justify-end lg:gap-2"
        >
          {item.tags.map((t) => (
            <li
              key={t}
              className="rounded-full bg-chip px-2.5 py-1 text-xs font-semibold lg:bg-surface-2 lg:px-3 lg:py-[5px] lg:text-sm"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-[11px] lg:grid-cols-3 lg:gap-8">
        {blocks.map((b, k) => (
          <div key={b.label} {...fx(index, 4 + k)} className="flex flex-col gap-1 lg:gap-2.5">
            <div className={`eyebrow ${b.color}`}>{b.label}</div>
            <p className="m-0 text-[15px] leading-[1.5] lg:text-base lg:leading-[1.6]">{b.text}</p>
            {k === 2 && (
              <div
                {...fx(index, 7)}
                className="mt-[7px] self-start rounded-[10px] bg-chip px-3 py-1.5 font-serif text-[15px] font-semibold lg:mt-1.5 lg:bg-surface-2 lg:px-3.5 lg:py-2 lg:text-base"
              >
                {item.metric}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

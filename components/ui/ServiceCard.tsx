import type { CSSProperties } from 'react';
import { ClipboardIcon, CodeIcon, NetworkIcon } from './Icons';

// Per card: column (--k), deal window [desktop, phone], icon reveal [desktop, phone] and colours.
const CARDS = [
  {
    k: -1,
    deal: ['0 0.6', '0 0.5'],
    icon: { fx: 'pop', ease: 'back', at: ['0.6 0.72', '0.52 0.62'] },
    Icon: CodeIcon,
    tone: 'bg-terra text-terra-ink',
  },
  {
    k: 0,
    deal: ['0.03 0.63', '0.03 0.53'],
    icon: { fx: 'spin', at: ['0.66 0.78', '0.58 0.68'] },
    Icon: ClipboardIcon,
    tone: 'bg-ocre text-[#1F1A15]',
  },
  {
    k: 1,
    deal: ['0.06 0.66', '0.06 0.56'],
    icon: { fx: 'zoom', at: ['0.72 0.84', '0.64 0.74'] },
    Icon: NetworkIcon,
    tone: 'bg-green text-bg',
  },
];

type Service = { title: string; text: string; bullets: string[] };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { k, deal, icon, Icon, tone } = CARDS[index];
  return (
    <div
      data-fx="deal"
      data-at={deal[0]}
      data-at-m={deal[1]}
      style={{ '--k': k } as CSSProperties}
      className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-5 lg:gap-4 lg:rounded-3xl lg:p-8"
    >
      <div className="flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-4">
        <div
          data-fx={icon.fx}
          data-ease={icon.ease}
          data-at={icon.at[0]}
          data-at-m={icon.at[1]}
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl lg:size-14 lg:rounded-2xl ${tone}`}
        >
          <Icon className="size-[22px] lg:size-7" />
        </div>
        <h3 className="m-0 font-serif text-xl leading-[1.2] font-semibold lg:text-2xl">{service.title}</h3>
      </div>
      <p className="m-0 text-[15px] leading-[1.55] text-ink lg:text-base lg:leading-[1.6]">{service.text}</p>
      <ul className="m-0 flex list-none flex-col gap-1.5 border-t border-line p-0 pt-2.5 text-[13px] font-medium text-muted lg:gap-2 lg:pt-4 lg:text-sm">
        {service.bullets.map((b) => (
          <li key={b} className="flex items-center gap-[9px] lg:gap-2.5">
            <span aria-hidden="true" className="diamond size-1.5 bg-ocre" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

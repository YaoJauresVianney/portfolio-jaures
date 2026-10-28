import Image from 'next/image';
import { site } from '@/content/site';
import { Pattern } from './Patterns';

/** Hero photo in relief: kita frame (back), photo (middle), "Double casquette" card (front). */
export function PhotoDiorama() {
  const { photo, photoPlaceholder, card } = site.hero;
  return (
    <div className="ph-scene relative mb-1.5 h-[min(210px,25vh)] w-[min(250px,66cqw)] shrink-0 self-center perspective-[800px] perspective-origin-[50%_45%] max-lg:order-first lg:mb-0 lg:h-[min(520px,60vh)] lg:w-[min(420px,30vw)] lg:perspective-[1100px]">
      <div className="ph-tilt absolute inset-0 transform-3d" data-tilt="">
        <div className="absolute inset-0 -translate-z-[30px] lg:-translate-z-[50px]">
          <div
            data-fx="iris"
            data-intro="250"
            className="absolute inset-0 overflow-hidden rounded-[125px_125px_20px_20px] bg-surface-2 shadow-[0_20px_40px_rgba(31,26,21,0.16)] lg:rounded-[210px_210px_28px_28px] lg:shadow-[0_30px_60px_rgba(31,26,21,0.16)]"
          >
            <Pattern kind="kita" className="absolute inset-0 size-full text-terra opacity-55" />
          </div>
        </div>
        <div className="absolute inset-5 translate-z-5 lg:inset-[34px] lg:translate-z-[30px]">
          <div
            data-fx="mask"
            data-intro="550"
            className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-[105px_105px_14px_14px] bg-surface text-[13px] font-semibold text-muted lg:rounded-[180px_180px_18px_18px] lg:text-sm lg:shadow-[0_16px_36px_rgba(31,26,21,0.12)] ${photo ? '' : 'border-2 border-dashed border-line'}`}
          >
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) 352px, 210px"
                className="object-cover"
              />
            ) : (
              photoPlaceholder
            )}
          </div>
        </div>
        <div className="absolute -bottom-3.5 -left-[34px] w-[168px] translate-z-11 lg:bottom-10 lg:-left-5 lg:w-[260px] lg:translate-z-[90px]">
          <div
            data-fx="right"
            data-intro="1000"
            className="flex flex-col gap-1 rounded-[14px] border border-line bg-surface px-3 py-2.5 shadow-[0_18px_36px_rgba(31,26,21,0.2)] lg:gap-1.5 lg:rounded-[18px] lg:px-[22px] lg:py-5 lg:shadow-[0_24px_48px_rgba(31,26,21,0.2)]"
          >
            <div className="eyebrow text-green-text">{card.eyebrow}</div>
            <div className="font-serif text-[15px] leading-[1.25] font-semibold lg:text-xl">{card.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

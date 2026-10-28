import { EMAIL, site, WHATSAPP_URL } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';
import { WhatsAppIcon } from '@/components/ui/Icons';

export function Contact() {
  const c = site.contact;
  return (
    <section id="contact" data-scene="contact" aria-labelledby="contact-title" className="sc sc-contact">
      <div className="stage bg-bg">
        <Pattern kind="losange" className="pat inset-0 h-[120%] w-full text-green" />
        <div className="stage-in flex flex-col gap-6 lg:gap-10">
          <div
            data-fx="zoom"
            data-at="0 0.25"
            className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-contact-bg px-[22px] py-[26px] text-on-dark lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:rounded-[32px] lg:px-20 lg:py-[72px] [&_:focus-visible]:outline-on-dark"
          >
            <Pattern
              kind="kita"
              data-fx="curtain"
              data-at="0.1 0.5"
              className="absolute top-0 right-0 h-[90px] w-full text-[#F6EFE4] opacity-16 lg:h-full lg:w-[420px]"
            />
            {/* On a phone the two text groups dissolve into the panel's single column. */}
            <div className="max-lg:contents lg:relative lg:flex lg:max-w-[640px] lg:flex-col lg:gap-[22px]">
              <div data-fx="drop" data-at="0.15 0.3" className="eyebrow relative pt-[66px] text-[#F7D58F] lg:pt-0">
                {c.eyebrow}
              </div>
              <h2
                id="contact-title"
                data-fx="blur"
                data-at="0.2 0.45"
                className="h2 relative text-[32px] leading-[1.08] lg:text-[52px] lg:leading-[1.02]"
              >
                {c.title}
              </h2>
              <p
                data-fx="rise"
                data-at="0.35 0.52"
                className="relative m-0 text-base leading-[1.55] text-on-dark-muted lg:text-lg lg:leading-[1.6]"
              >
                {c.text}
              </p>
              <div className="max-lg:contents lg:flex lg:items-center lg:gap-6 lg:pt-2">
                <div data-fx="pop" data-ease="back" data-at="0.48 0.62" className="relative lg:origin-left">
                  <a
                    href={WHATSAPP_URL}
                    className="btn flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-[#F6EFE4] text-base font-bold text-[#1F4D3A] lg:h-[60px] lg:gap-3 lg:px-[30px] lg:text-lg"
                  >
                    <WhatsAppIcon handset className="size-5 lg:size-6" />
                    {c.cta}
                  </a>
                </div>
                <a
                  data-fx="wipe"
                  data-at="0.56 0.7"
                  href={`mailto:${EMAIL}`}
                  className="relative -my-3 self-center py-3 text-[15px] font-semibold text-on-dark underline underline-offset-4 max-lg:[overflow-wrap:anywhere] lg:self-auto lg:text-base"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
            <dl
              data-fx="flip"
              data-at="0.6 0.78"
              className="relative m-0 flex flex-col gap-3 rounded-2xl bg-[rgba(21,17,13,0.28)] px-[18px] py-4 lg:box-content lg:w-[300px] lg:shrink-0 lg:gap-5 lg:rounded-[20px] lg:p-7"
            >
              {c.info.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 lg:gap-1">
                  <dt className="eyebrow text-[#F7D58F]">{item.label}</dt>
                  <dd className="m-0 text-[15px] font-semibold lg:text-base">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <footer
            data-fx="rise"
            data-at="0.75 0.92"
            className="flex flex-col items-center gap-1.5 border-t border-line pt-4 text-center text-[13px] text-balance text-muted lg:flex-row lg:justify-between lg:pt-6 lg:text-left lg:text-sm"
          >
            <span>{site.footer.copyright}</span>
            <span className="flex items-center gap-2 lg:gap-2.5">
              <Pattern kind="zigzag" className="h-3 w-9 text-ocre lg:w-10" />
              {site.footer.madeIn}
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
}

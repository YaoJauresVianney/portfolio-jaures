import { site } from '@/content/site';
import { Pattern } from '@/components/ui/Patterns';
import { ServiceCard } from '@/components/ui/ServiceCard';

export function Services() {
  const s = site.services;
  return (
    <section id="services" data-scene="services" aria-labelledby="services-title" className="sc sc-services">
      <div className="stage bg-surface-2">
        <Pattern kind="zigzag" className="absolute top-0 left-0 z-[2] h-4 w-full text-ocre opacity-70 lg:h-5" />
        <Pattern kind="losange" className="pat inset-0 h-[120%] w-full text-terra" />
        <div className="stage-in flex flex-col gap-5 lg:gap-11">
          <div className="flex max-w-[760px] flex-col gap-2.5 lg:gap-3.5">
            <div data-fx="drop" data-src="e" data-at="0.45 0.8" className="eyebrow text-ocre-ink">
              {s.eyebrow}
            </div>
            <h2 id="services-title" data-fx="blur" data-src="e" data-at="0.55 0.95" className="h2">
              {s.title}
            </h2>
          </div>
          <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-3 lg:gap-6">
            {s.items.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>
        </div>
        <div className="cube-shade" aria-hidden="true" />
      </div>
    </section>
  );
}

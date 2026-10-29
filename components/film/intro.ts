/** Attributes of a hero element that plays `fx` once on load, `ms` after first paint (CSS, see motion.css). */
export const intro = (fx: string, ms: number) => ({
  'data-fx': fx,
  'data-intro': ms,
  style: { animationDelay: `${ms}ms` },
});

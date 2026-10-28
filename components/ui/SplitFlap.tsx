/** Airport-style split-flap panel: blank → 2 scrambles → name, each face split in two half-flaps. */
export function SplitFlap({ name, scramble, at }: { name: string; scramble: string[]; at: string }) {
  const faces = ['', ...scramble, name];
  return (
    <>
      <span className="sr-only">{name}</span>
      <div className="flap" data-fx="flap" data-ease="linear" data-at={at} aria-hidden="true">
        {faces.flatMap((face, j) =>
          ['top', 'bot'].map((half) => (
            <div key={half + j} className={`flap-h ${half} f${j}`}>
              <span>{face}</span>
            </div>
          )),
        )}
      </div>
    </>
  );
}

export default function RatingStars({ value = 0, size = 'sm', interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeCls = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm';

  return (
    <div className={`flex items-center gap-0.5 ${sizeCls}`}>
      {stars.map((n) => {
        const filled = n <= Math.round(value);
        const cls = filled ? 'text-yellow-400' : 'text-gray-300';
        const handler = interactive ? () => onChange?.(n) : undefined;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={handler}
            className={`${cls} ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >★</button>
        );
      })}
    </div>
  );
}

import { useRef } from 'react';

// Interactive 3D tilt: the element leans toward the pointer.
//   glare  – show the moving light highlight (good for solid cards)
//   card   – apply the rounded "lifted card" drop-shadow (off for transparent
//            content like the hero emoji)
// Falls back to no motion when the user prefers reduced motion (handled in CSS).
export default function Tilt3D({ children, className = '', max = 9, glare = true, card = true }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;           // hidden / not laid out yet
    const px = (e.clientX - r.left) / r.width;   // 0 → 1 across
    const py = (e.clientY - r.top) / r.height;   // 0 → 1 down
    el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  return (
    <div
      ref={ref}
      className={`tilt3d-wrap ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <div className={`tilt3d-inner ${card ? 'tilt3d-card' : ''}`}>
        {children}
        {glare && <div className="tilt3d-glare" aria-hidden="true" />}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import './LaunchOverlay.css';

/**
 * One-time grand-launch ribbon-cutting overlay. Shows on a visitor's first
 * visit only (a localStorage flag is set when they Enter the store or Skip).
 * Fully self-contained: it loads its own fonts lazily and everything is scoped
 * under .fluro-launch so the storefront is untouched.
 */
const SEEN_KEY = 'fluro_launch_seen';
const REDUCE = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#35E17E', '#12C765', '#ECC96A', '#FFFFFF', '#8CF7B6', '#C99B3F'];

export default function LaunchOverlay() {
  const [show, setShow] = useState(() => {
    try { return !localStorage.getItem(SEEN_KEY); } catch { return false; }
  });
  const [cut, setCut] = useState(false);
  const [fall, setFall] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [closing, setClosing] = useState(false);

  const canvasRef = useRef(null);
  const partsRef = useRef([]);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const timersRef = useRef([]);

  // Lazy-load the launch fonts + lock scroll only while the overlay is up.
  useEffect(() => {
    if (!show) return undefined;
    const id = 'fluro-launch-fonts';
    if (!document.getElementById(id)) {
      const l = document.createElement('link');
      l.id = id;
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap';
      document.head.appendChild(l);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  const loop = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) { runningRef.current = false; return; }
    const ctx = cv.getContext('2d');
    rafRef.current = requestAnimationFrame(loop);
    const W = cv.clientWidth, H = cv.clientHeight;
    ctx.clearRect(0, 0, W, H);
    const parts = partsRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++;
      p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.flip += p.vf;
      if (p.life > p.max || p.y > H + 40) { parts.splice(i, 1); continue; }
      const alpha = p.life > p.max - 40 ? (p.max - p.life) / 40 : 1;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, alpha); ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.flip)));
      ctx.restore();
    }
    if (!parts.length) { runningRef.current = false; cancelAnimationFrame(rafRef.current); ctx.clearRect(0, 0, W, H); }
  }, []);

  const burst = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = cv.clientWidth * DPR; cv.height = cv.clientHeight * DPR;
    cv.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
    const W = cv.clientWidth, H = cv.clientHeight, cx = W / 2, cy = H * 0.46, n = REDUCE ? 70 : 160;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 6 + Math.random() * 15;
      partsRef.current.push({
        x: cx + (Math.random() - 0.5) * 260, y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(a) * sp * (0.5 + Math.random()), vy: Math.sin(a) * sp * 0.7 - (4 + Math.random() * 7),
        g: 0.28 + Math.random() * 0.18, w: 6 + Math.random() * 8, h: 9 + Math.random() * 12,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, col: COLORS[(Math.random() * COLORS.length) | 0],
        life: 0, max: 120 + Math.random() * 80, flip: Math.random() * 6.28, vf: 0.15 + Math.random() * 0.2,
      });
    }
    if (!runningRef.current) { runningRef.current = true; loop(); }
  }, [loop]);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const open = useCallback(() => {
    if (cut) return;
    setCut(true);
    if (REDUCE) { setFall(true); setRevealed(true); burst(); return; }
    timersRef.current.push(setTimeout(() => { setFall(true); burst(); }, 660));
    timersRef.current.push(setTimeout(() => setRevealed(true), 1350));
  }, [cut, burst]);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode: still close */ }
    clearTimers();
    cancelAnimationFrame(rafRef.current);
    setClosing(true);
    setTimeout(() => setShow(false), 600);
  }, []);

  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current); }, []);

  if (!show) return null;

  const cls = ['fluro-launch', cut && 'cut', fall && 'fall', revealed && 'revealed', closing && 'closing']
    .filter(Boolean).join(' ');

  return (
    <div className={cls} role="dialog" aria-label="Fluro Tech grand opening">
      <div className="spotlight" />
      <canvas className="confetti" ref={canvasRef} />
      <button className="skip" onClick={dismiss} aria-label="Skip the intro">Skip &rarr;</button>

      <div className="fl-top">
        <div className="plate"><span className="dotpulse" /> Marthandam &middot; Kanyakumari <b>Est. 2026</b></div>
      </div>

      <div className="center">
        <div className="mark">
          <span className="tile" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4.5" width="18" height="12" rx="1.6" stroke="#062012" strokeWidth="1.8" />
              <path d="M2 19h20M7 12l3-3 2.4 2.4L16.5 7" stroke="#062012" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="wm">FLURO<i> TECH</i></span>
        </div>
        <p className="eyebrow">Grand Opening &middot; Ribbon Cutting</p>
        <div className="ribbon">
          <div className="band band-l"><span className="sheen" /></div>
          <div className="band band-r"><span className="sheen" /></div>
          <div className="rosette" aria-hidden="true">
            <span className="tail t1" /><span className="tail t2" />
            <span className="disc"><span className="core"><span>F</span></span></span>
          </div>
          <div className="scissors" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8.1 7.6 20 17M8.1 16.4 20 7M8.6 12 12 12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="fl-foot">
        <div className="prompt">
          <button className="cut-btn" onClick={open}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8.1 7.6 20 17M8.1 16.4 20 7" />
            </svg>
            Cut the ribbon
          </button>
          <span className="hint">A new beginning &middot; click to open</span>
        </div>
      </div>

      <div className="reveal" aria-live="polite">
        <p className="kicker">The ribbon is cut</p>
        <h1>WE&rsquo;RE LIVE</h1>
        <p><b>Fluro Tech is open.</b> Laptops, used laptops &amp; CCTV &mdash; hand-picked and set up right, now in Marthandam.</p>
        <button className="cta" onClick={dismiss}>Enter the store &rarr;</button>
        <p className="foot">Power your work &middot; Pick a laptop you&rsquo;ll love</p>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

const N = 420;

function heartPoints(n: number) {
  // sample a grid inside the classic heart curve, pick n evenly
  const pts: [number, number][] = [];
  for (let y = 1.3; y >= -1.2; y -= 0.045) {
    for (let x = -1.25; x <= 1.25; x += 0.11) {
      const v = (x * x + y * y - 1) ** 3 - x * x * y ** 3;
      if (v <= 0) pts.push([x, -y]);
    }
  }
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) out.push(pts[Math.floor((i * pts.length) / n)]);
  return out;
}

export function LoveSpiral({ onDone }: { onDone: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const state = useRef({ ox: 0, oy: 0, t0: 0, morph: -1, drag: null as null | { x: number; y: number; ox: number; oy: number; moved: number } });
  const [hearted, setHearted] = useState(false);

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const hp = heartPoints(N);
    const parts = Array.from({ length: N }).map((_, i) => {
      const th = i * 0.115 + 0.6;
      return { th, r: 6 + th * 4.6, hx: hp[i][0], hy: hp[i][1], delay: Math.random() * 0.6, size: 7 + Math.random() * 4, a: 0.55 + Math.random() * 0.45 };
    });
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; };
    resize();
    window.addEventListener("resize", resize);
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
    const draw = (now: number) => {
      const s = state.current;
      const w = c.clientWidth, h = c.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 560;
      const cx = w / 2 + s.ox, cy = h / 2 + s.oy;
      const rot = now / 9000;
      const mt = s.morph < 0 ? 0 : (now - s.morph) / 2600;
      const pulse = 1 + Math.sin(now / 500) * 0.025;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,120,170,.9)"; ctx.shadowBlur = 8;
      for (const p of parts) {
        const ang = p.th + rot;
        const sx = Math.cos(ang) * p.r * scale, sy = Math.sin(ang) * p.r * scale * 0.92;
        const hs = 205 * scale * (mt >= 1 ? pulse : 1);
        const hx = p.hx * hs, hy = p.hy * hs - 15 * scale;
        const k = ease(Math.max(0, Math.min(1, (mt - p.delay * 0.5) / 0.7)));
        const x = sx + (hx - sx) * k, y = sy + (hy - sy) * k;
        const r = (ang + Math.PI / 2) * (1 - k);
        ctx.save();
        ctx.translate(cx + x, cy + y);
        ctx.rotate(r);
        ctx.font = `500 ${p.size * scale * (1 - k * 0.15) + 1}px "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = `rgba(255,${170 + Math.round(60 * k)},${200 + Math.round(20 * k)},${p.a})`;
        ctx.fillText("I love you", 0, 0);
        ctx.restore();
      }
      if (s.morph < 0) {
        ctx.shadowBlur = 24;
        ctx.fillStyle = "#ff8fb4";
        ctx.font = `${30 * scale + 6}px serif`;
        ctx.fillText("♥", cx, cy + Math.sin(now / 300) * 2);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const down = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const s = state.current;
    s.drag = { x: e.clientX, y: e.clientY, ox: s.ox, oy: s.oy, moved: 0 };
  };
  const move = (e: React.PointerEvent) => {
    const s = state.current; if (!s.drag) return;
    const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
    s.drag.moved = Math.max(s.drag.moved, Math.hypot(dx, dy));
    s.ox = s.drag.ox + dx; s.oy = s.drag.oy + dy;
  };
  const up = (e: React.PointerEvent) => {
    const s = state.current; const d = s.drag; s.drag = null;
    if (!d || d.moved > 8 || s.morph >= 0) return;
    const rect = cv.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + s.ox, cy = rect.top + rect.height / 2 + s.oy;
    const hit = Math.max(50, Math.min(rect.width, rect.height) * 0.12);
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < hit) {
      s.morph = performance.now();
      setTimeout(() => setHearted(true), 2800);
    }
  };

  return (
    <div className="spiral-wrap">
      <h2 className="sec-title light">{hearted ? "Every word, for you" : "Hundreds of ways to say it"}</h2>
      <p className="sec-sub light">{hearted ? "" : "Drag it around · tap the heart in the center"}</p>
      <canvas ref={cv} className="spiral-cv" aria-label="Interactive spiral of 'I love you'"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => (state.current.drag = null)} />
      <button className={`btn-soft ${hearted ? "show" : "hide"}`} type="button" onClick={onDone}>Next</button>
    </div>
  );
}

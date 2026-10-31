import { useEffect, useRef, useState } from "react";

const N = 1400;

// A complete volumetric 3D heart: the classic implicit heart surface
//   f(x,y,z) = (x² + 9/4 z² + y² − 1)³ − x²y³ − (9/80)y²z³ ≤ 0
// Most particles sit ON the surface (crisp silhouette from every angle),
// the rest fill the interior so the volume never looks hollow.
function heartVolume(n: number) {
  const f = (x: number, y: number, z: number) => {
    const a = x * x + (9 / 4) * z * z + y * y - 1;
    return a * a * a - x * x * y * y * y - (9 / 80) * y * y * z * z * z;
  };
  const sampleInterior = (): [number, number, number] => {
    for (;;) {
      const x = (Math.random() * 2 - 1) * 1.25;
      const y = -1.15 + Math.random() * 2.6;
      const z = (Math.random() * 2 - 1) * 0.75;
      if (f(x, y, z) <= 0) return [x, y, z];
    }
  };
  // push an interior point outward along its ray until it hits the surface
  const toSurface = (p: [number, number, number]): [number, number, number] => {
    let lo = 1, hi = 3;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (f(p[0] * mid, p[1] * mid, p[2] * mid) <= 0) lo = mid; else hi = mid;
    }
    return [p[0] * lo, p[1] * lo, p[2] * lo];
  };
  const pts: [number, number, number][] = [];
  const surfaceN = Math.round(n * 0.72);
  for (let i = 0; i < n; i++) {
    const p = sampleInterior();
    pts.push(i < surfaceN ? toSurface(p) : p);
  }
  // normalize so the farthest point sits at radius ~1.05 (fits any rotation)
  let maxR = 0;
  for (const p of pts) maxR = Math.max(maxR, Math.hypot(p[0], p[1], p[2]));
  const k = 1.05 / maxR;
  return pts.map((p) => [p[0] * k, p[1] * k, p[2] * k] as [number, number, number]);
}

export function LoveSpiral({ onDone }: { onDone: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({
    rotY: 0,
    rotX: -0.15,
    velY: 0.004,
    velX: 0,
    morph: -1,
    drag: null as null | { lx: number; ly: number; moved: number },
  });
  const [hearted, setHearted] = useState(false);

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const hp = heartVolume(N);
    const parts = hp.map((h, i) => {
      // scattered start positions on a sphere shell
      const th = i * 2.39996;
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      return {
        sx: Math.cos(th) * r * 1.9,
        sy: y * 1.9,
        sz: Math.sin(th) * r * 1.9,
        hx: h[0],
        hy: h[1],
        hz: h[2],
        delay: Math.random() * 0.5,
        size: 7.5 + Math.random() * 4,
        a: 0.55 + Math.random() * 0.45,
      };
    });
    const order = parts.map((_, i) => i);
    const zs = new Float32Array(N);
    const pxs = new Float32Array(N);
    const pys = new Float32Array(N);
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

    const draw = (now: number) => {
      const s = st.current;
      const w = c.clientWidth;
      const h = c.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // idle spin + drag inertia easing back to idle speed
      const mt0 = s.morph < 0 ? 0 : (now - s.morph) / 2400;
      if (!s.drag) {
        s.rotY += s.velY;
        s.rotX += s.velX;
        s.velY += (0.004 - s.velY) * 0.02;
        s.velX *= 0.95;
        // while morphing, gently settle back to a front-facing view
        if (s.morph >= 0 && mt0 < 1) {
          const targetY = Math.round(s.rotY / (Math.PI * 2)) * Math.PI * 2;
          s.rotY += (targetY - s.rotY) * 0.06;
          s.rotX += (-0.15 - s.rotX) * 0.06;
        }
      }

      const cosY = Math.cos(s.rotY), sinY = Math.sin(s.rotY);
      const cosX = Math.cos(s.rotX), sinX = Math.sin(s.rotX);
      // scale so the whole heart (radius ~1.05 × perspective gain) always fits
      const S = Math.min(w, h) / 3.6;
      const cx = w / 2, cyc = h / 2;
      const mt = s.morph < 0 ? 0 : (now - s.morph) / 2400;
      const pulse = mt >= 1 ? 1 + Math.sin(now / 480) * 0.03 : 1;

      for (let i = 0; i < N; i++) {
        const p = parts[i]!;
        const k = ease(Math.max(0, Math.min(1, (mt - p.delay * 0.5) / 0.7)));
        const x = (p.sx + (p.hx - p.sx) * k) * pulse;
        const y = (p.sy + (p.hy - p.sy) * k) * pulse;
        const z = (p.sz + (p.hz - p.sz) * k) * pulse;
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const sc = 3 / (3 - z2 * 0.85);
        zs[i] = z2;
        pxs[i] = cx + x1 * sc * S;
        pys[i] = cyc + y2 * sc * S;
      }

      // painter's algorithm: far texts first
      order.sort((a, b) => zs[a]! - zs[b]!);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const i of order) {
        const p = parts[i]!;
        const z2 = zs[i]!;
        const sc = 3 / (3 - z2 * 0.85);
        const depth = Math.max(0, Math.min(1, (z2 + 1.05) / 2.1)); // 0 far → 1 near
        ctx.font = `500 ${Math.max(3, p.size * sc * (S / 150))}px "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = `rgba(${130 + Math.round(125 * depth)},${50 + Math.round(140 * depth)},${95 + Math.round(115 * depth)},${(0.14 + 0.86 * depth) * p.a})`;
        ctx.shadowColor = "rgba(255,120,170,.8)";
        ctx.shadowBlur = depth > 0.55 ? 7 : 0;
        ctx.fillText("I love you", pxs[i]!, pys[i]!);
      }
      ctx.shadowBlur = 0;

      if (s.morph < 0) {
        ctx.shadowColor = "rgba(255,120,170,.9)";
        ctx.shadowBlur = 24;
        ctx.fillStyle = "#ff8fb4";
        ctx.font = `${30 * (S / 150) + 6}px serif`;
        ctx.fillText("♥", cx, cyc + Math.sin(now / 300) * 2);
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const down = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    st.current.drag = { lx: e.clientX, ly: e.clientY, moved: 0 };
  };
  const move = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    const dx = e.clientX - s.drag.lx;
    const dy = e.clientY - s.drag.ly;
    s.drag.moved = Math.max(s.drag.moved, Math.hypot(dx, dy));
    s.rotY += dx * 0.006;
    s.rotX += dy * 0.006; // full 360° — no clamp
    s.velY = dx * 0.006;
    s.velX = dy * 0.006;
    s.drag.lx = e.clientX;
    s.drag.ly = e.clientY;
  };
  const up = (e: React.PointerEvent) => {
    const s = st.current;
    const d = s.drag;
    s.drag = null;
    if (!d || d.moved > 8 || s.morph >= 0) return;
    const rect = cv.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const hit = Math.max(50, Math.min(rect.width, rect.height) * 0.12);
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < hit) {
      s.morph = performance.now();
      setTimeout(() => setHearted(true), 2600);
    }
  };

  return (
    <div className="spiral-wrap">
      <h2 className="sec-title light">{hearted ? "Every word, for you" : "Hundreds of ways to say it"}</h2>
      <p className="sec-sub light">
        {hearted ? "Drag to spin it — it says the same thing from every angle" : "Drag to spin · tap the heart in the center"}
      </p>
      <canvas
        ref={cv}
        className="spiral-cv"
        aria-label="Interactive 3D heart made of 'I love you'"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => (st.current.drag = null)}
      />
      <button className={`btn-soft ${hearted ? "show" : "hide"}`} type="button" onClick={onDone}>
        Next
      </button>
    </div>
  );
}

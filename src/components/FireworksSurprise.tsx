import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIREWORK_TIMES, fireworksAt } from "@/lib/memoryBook";

export function FireworksSurprise({ onDone }: { onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [moment, setMoment] = useState(0);
  const [ready, setReady] = useState(false);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(c);
    const colors = ["--firework-pink", "--firework-gold", "--firework-light"].map((token) => style.getPropertyValue(token).trim());
    const sky = style.getPropertyValue("--night-sky").trim();
    const stars = Array.from({ length: 95 }, (_, i) => ({ x: ((i * 73 + 19) % 997) / 997, y: ((i * 47 + 23) % 613) / 613, radius: .6 + (i % 3) * .35 }));
    const start = performance.now();
    const positions = [[.28, .38], [.72, .3], [.5, .32]];
    let raf = 0;
    let lastMoment = 0;
    const draw = (now: number) => {
      const elapsed = now - start;
      const w = c.clientWidth, h = c.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1; ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = colors[2] ?? sky;
      for (const star of stars) {
        ctx.globalAlpha = .25 + .4 * (1 + Math.sin(now / 1300 + star.x * 30)) / 2;
        ctx.beginPath(); ctx.arc(star.x * w, star.y * h * .87, star.radius, 0, Math.PI * 2); ctx.fill();
      }
      const count = fireworksAt(elapsed);
      if (count !== lastMoment) { lastMoment = count; setMoment(count); }
      FIREWORK_TIMES.forEach((time, index) => {
        const age = (elapsed - time) / 1000;
        const pos = positions[index];
        if (!pos) return;
        const cx = (pos[0] ?? .5) * w, cy = (pos[1] ?? .3) * h;
        if (age > -.8 && age < 0 && !reduced) {
          const t = (age + .8) / .8;
          ctx.globalAlpha = 1; ctx.strokeStyle = colors[index] ?? sky; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx, h - (h - cy) * t + 25); ctx.lineTo(cx, h - (h - cy) * t); ctx.stroke();
        }
        if (age < 0 || age > 3.1) return;
        const n = index === 2 ? 190 : 110;
        const radius = Math.min(w, h) * (index === 2 ? .42 : .28);
        for (let i = 0; i < n; i++) {
          const angle = i * 2.399963;
          const speed = .45 + ((i * 37) % 100) / 180;
          const t = reduced ? .8 : 1 - Math.exp(-age * 1.5);
          const x = cx + Math.cos(angle) * radius * speed * t;
          const y = cy + Math.sin(angle) * radius * speed * t + (reduced ? 0 : age * age * 14);
          ctx.globalAlpha = Math.max(0, 1 - age / 3.1);
          ctx.fillStyle = colors[(i + index) % 3] ?? sky;
          ctx.beginPath(); ctx.arc(x, y, index === 2 ? 2 : 1.6, 0, Math.PI * 2); ctx.fill();
          if (!reduced) { ctx.globalAlpha *= .45; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(angle) * 8, y - Math.sin(angle) * 8); ctx.stroke(); }
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const timer = setTimeout(() => setReady(true), 10500);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [cycle]);
  const replay = () => { setMoment(0); setReady(false); setCycle((n) => n + 1); };
  return <div className="fireworks-wrap">
    <p className="script">one more thing, just for you</p>
    <div className="fireworks-scene" data-fireworks={moment}>
      <canvas ref={canvas} aria-label="Three fireworks blooming in a starry night sky" />
      <div className={`fireworks-love ${moment === 3 ? "revealed" : ""}`} aria-hidden={moment < 3}><h2>I LOVE YOU</h2><p>In every world. In every little moment.</p></div>
    </div>
    <div className="fireworks-controls">
      <Button variant="ghost" className="romantic-control" onClick={replay} disabled={!ready}><RotateCcw />Once more</Button>
      <Button variant="ghost" className="romantic-control romantic-primary" onClick={onDone} disabled={!ready}>Letters for you<ArrowRight /></Button>
    </div>
    <span className="sr-only" aria-live="polite">{moment === 3 ? "I LOVE YOU" : moment ? `Firework ${moment} of 3` : "A surprise under the stars"}</span>
  </div>;
}
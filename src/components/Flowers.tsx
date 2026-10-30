const COLORS = [
  ["#f7c6d0", "#e89aac"], ["#fbd9e1", "#f2a9bb"], ["#fff8ee", "#f1dfc6"],
  ["#f6e7d3", "#e3c9a6"], ["#f9cfd8", "#d98da1"], ["#fde4ea", "#f5b8c6"],
];

function Flower({ size, c, petals, rot }: { size: number; c: string[]; petals: number; rot: number }) {
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse key={i} cx="0" cy="-22" rx="15" ry="24" fill={c[0]} stroke={c[1]} strokeWidth="1.2" opacity=".95" transform={`rotate(${(360 / petals) * i})`} />
      ))}
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse key={"i" + i} cx="0" cy="-12" rx="8" ry="13" fill={c[1]} opacity=".35" transform={`rotate(${(360 / petals) * i + 180 / petals})`} />
      ))}
      <circle r="9" fill="#f3d9a4" /><circle r="5" fill="#e6b973" />
    </svg>
  );
}

// deterministic positions around edges & corners, center kept clear
const SPOTS = Array.from({ length: 34 }).map((_, i) => {
  const t = (i * 137.5) % 360;
  const side = i % 4;
  const along = ((i * 53) % 100) / 100;
  const depth = ((i * 29) % 18) - 6;
  let x = 0, y = 0;
  if (side === 0) { x = along * 100; y = depth; }
  else if (side === 1) { x = along * 100; y = 100 - depth; }
  else if (side === 2) { x = depth; y = along * 100; }
  else { x = 100 - depth; y = along * 100; }
  return { x, y, size: 60 + ((i * 41) % 90), c: COLORS[i % COLORS.length]!, petals: 5 + (i % 3), rot: t, delay: (i % 12) * 0.09 };
});

export function FloralLayer({ on }: { on: boolean }) {
  return (
    <div className={`floral ${on ? "on" : ""}`} aria-hidden="true">
      {SPOTS.map((s, i) => (
        <div key={i} className="bloom" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s` }}>
          <Flower size={s.size} c={s.c} petals={s.petals} rot={s.rot} />
        </div>
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <span key={"p" + i} className="petal" style={{ left: `${(i * 47) % 100}%`, animationDelay: `${0.4 + (i % 11) * 0.8}s`, animationDuration: `${9 + (i % 5) * 2}s`, background: COLORS[i % COLORS.length]![0] }} />
      ))}
    </div>
  );
}

export function HeartRain({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <div className="heart-rain" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} style={{ left: `${(i * 61 + 7) % 100}%`, fontSize: `${10 + (i % 3) * 5}px`, animationDelay: `${(i * 1.7) % 14}s`, animationDuration: `${12 + (i % 4) * 3}s` }}>♥</span>
      ))}
    </div>
  );
}

export function RiseUp({ on }: { on: boolean }) {
  if (!on) return null;
  return (
    <div className="rise-up" aria-hidden="true">
      {Array.from({ length: 70 }).map((_, i) => {
        const flower = i % 3 !== 0;
        const size = 40 + ((i * 37) % 70);
        return (
          <div key={i} className="riser" style={{ left: `${(i * 43) % 100}%`, ["--h" as string]: `${20 + ((i * 29) % 95)}vh`, animationDelay: `${(i % 14) * 0.08}s`, width: size, height: size }}>
            {flower ? <Flower size={size} c={COLORS[i % COLORS.length]!} petals={5 + (i % 3)} rot={i * 23} /> : <span style={{ fontSize: size * 0.8 }}>♥</span>}
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Heart, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PETAL_COUNT, petalLoves, stageAfterPick, type GardenStage } from "@/lib/loveGarden";

const WORDS = ["I love you", "I need you", "Always us", "My home", "Stay with me", "You & me", "Forever", "My Haris"];
const CROWN = Array.from({ length: 210 }, (_, i) => {
  const angle = i * 2.399963;
  const radius = Math.sqrt((i + 0.5) / 210);
  return {
    x: 400 + Math.cos(angle) * radius * 272,
    y: 248 + Math.sin(angle) * radius * 175,
    word: WORDS[i % WORDS.length],
    delay: 2 + radius * 4.5 + (i % 5) * 0.15,
    turn: (i % 5 - 2) * 7,
  };
});
const BRANCHES = [
  "M400 567 Q385 468 400 330 Q395 218 410 132",
  "M398 437 Q347 345 235 240 Q196 204 168 181",
  "M400 385 Q453 300 559 222 Q586 190 615 170",
  "M398 334 Q321 264 290 160",
  "M408 306 Q468 218 491 125",
  "M352 347 Q272 326 205 295",
  "M455 304 Q548 295 633 258",
];

export function LoveGarden({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [stage, setStage] = useState<GardenStage>("growing");
  const [picked, setPicked] = useState<number[]>([]);
  const [cycle, setCycle] = useState(0);
  const loves = petalLoves(picked.length);
  useEffect(() => {
    const delay = stage === "growing" ? 3000 : stage === "planting" ? 4200 : stage === "tree" ? 11000 : null;
    if (delay === null) return;
    const timer = setTimeout(() => setStage(stage === "growing" ? "picking" : stage === "planting" ? "tree" : "complete"), delay);
    return () => clearTimeout(timer);
  }, [stage, cycle]);

  const pick = (index: number) => {
    if (stage !== "picking" || picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);
    setStage(stageAfterPick(next.length));
  };
  const isTree = stage === "tree" || stage === "complete";
  const replay = () => { setPicked([]); setStage("growing"); setCycle((n) => n + 1); };
  const phrase = picked.length ? loves ? "You love me." : "You don't love me." : "A little love, taking root.";
  return (
    <div className="garden-wrap" data-stage={stage}>
      <p className="script">something beautiful grows here</p>
      <h2 className="sec-title">Love Takes Root</h2>
      <div className="garden-message" aria-live="polite" aria-atomic="true">
        <p key={`${stage}-${picked.length}`} className={loves ? "garden-loving" : ""}>
          {isTree ? "From one little flower, a lifetime of love." : phrase}
        </p>
      </div>
      <div key={cycle} className={`garden-scene garden-${stage}`}>
        <svg viewBox="0 0 800 650" className="garden-art" aria-label={isTree ? "A growing tree made of romantic words" : "A pink flower growing from the soil"} role="img">
          <ellipse cx="400" cy="574" rx="295" ry="16" className="garden-ground" />
          <path d="M110 575 Q400 559 690 575" className="garden-soil-line" />
          <g className="garden-flower-stem">
            <path d="M400 568 Q385 445 400 285" pathLength="1" className="garden-stem" />
            <path d="M397 460 Q324 462 330 400 Q386 401 397 460" className="garden-leaf leaf-left" />
            <path d="M397 416 Q463 414 461 355 Q411 357 397 416" className="garden-leaf leaf-right" />
          </g>
          <g className="garden-seed"><circle cx="400" cy="285" r="23" /><circle cx="393" cy="278" r="5" className="seed-glint" /></g>
          {isTree && <g className="garden-tree">
            <g className="garden-roots">
              {["M400 568 Q365 603 305 613", "M400 568 Q435 604 495 613", "M400 568 Q396 607 413 633"].map((d) => <path key={d} d={d} pathLength="1" />)}
            </g>
            {BRANCHES.map((d, i) => <path key={d} d={d} pathLength="1" className={`garden-branch branch-${i}`} />)}
            <g className="garden-trunk-words">
              {Array.from({ length: 21 }, (_, i) => <text key={i} x={400 + Math.sin(i) * 8} y={560 - i * 16} textAnchor="middle" className="garden-word" style={{ animationDelay: `${1 + i * 0.13}s` }}>{WORDS[i % WORDS.length]}</text>)}
            </g>
            {CROWN.map((p, i) => <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.turn})`}><text textAnchor="middle" className={`garden-word tone-${i % 3}`} style={{ animationDelay: `${p.delay}s` }}>{p.word}</text></g>)}
            {Array.from({ length: 18 }, (_, i) => <text key={`heart-${i}`} x={160 + (i * 97) % 480} y={110 + (i * 53) % 300} className="garden-tree-heart" style={{ animationDelay: `${7 + (i % 4) * 0.5}s` }}>♥</text>)}
          </g>}
        </svg>
        {!isTree && <div className="garden-petals">
          {Array.from({ length: PETAL_COUNT }, (_, i) => <Button
            key={i} variant="ghost" aria-label={`Pick petal ${i + 1}`} disabled={stage !== "picking" || picked.includes(i)}
            className={`garden-petal ${picked.includes(i) ? "picked" : ""}`}
            style={{ "--petal-angle": `${i * 45}deg`, "--petal-delay": `${1.6 + i * 0.08}s` } as React.CSSProperties}
            onClick={() => pick(i)}
          />)}
        </div>}
      </div>
      <div className="garden-ending" aria-live="polite">
        {stage === "complete" && <><Heart aria-hidden="true" /><p>And every branch leads back to you, Haris.</p></>}
      </div>
      <div className="garden-actions">
        <Button variant="ghost" onClick={onBack} className="garden-back"><ArrowLeft />Back to us</Button>
        {stage === "complete" && <Button variant="ghost" onClick={replay} className="garden-replay"><RotateCcw />Grow it again</Button>}
        {stage === "complete" && <Button variant="ghost" onClick={onNext} className="romantic-control romantic-primary">Our little story<ArrowRight /></Button>}
      </div>
    </div>
  );
}
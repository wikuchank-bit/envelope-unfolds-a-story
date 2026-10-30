import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { LockScreen } from "@/components/LockScreen";
import { FloralLayer } from "@/components/Flowers";
import { LoveSpiral } from "@/components/LoveSpiral";
import { LdrMap } from "@/components/LdrMap";
import { MEMORIES } from "@/lib/memories";
import loveCss from "../love.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For You, Haris" },
      { name: "description", content: "A sealed letter and a little love story, written just for Haris." },
      { property: "og:title", content: "For You, Haris" },
      { property: "og:description", content: "A sealed letter and a little love story, written just for Haris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&display=swap" },
      { rel: "stylesheet", href: loveCss },
    ],
  }),
  component: Index,
});

export const LETTER = `Dear Haris,

Even though we've had our fair share of arguments and moments when our egos got in the way, I am still grateful that we have always tried to become better and continued making an effort for each other.`;

// Relationship start: 22 November 2025
export const START = new Date(2025, 10, 22, 0, 0, 0);

export function elapsed(from: Date, to: Date) {
  let s = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
  const days = Math.floor(s / 86400); s -= days * 86400;
  const hours = Math.floor(s / 3600); s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  return { days, hours, minutes, seconds: s - minutes * 60 };
}

type Screen = "envelope" | "letter" | "lock" | "time" | "story" | "spiral" | "map";

function Typewriter({ text, onDone }: { text: string; onDone: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) { onDone(); return; }
    const ch = text[n - 1];
    const delay = ch === "\n" ? 380 : ch === "," || ch === "." ? 260 : 32 + Math.random() * 40;
    const t = setTimeout(() => setN(n + 1), delay);
    return () => clearTimeout(t);
  }, [n, text, onDone]);
  return <div className="typed">{text.slice(0, n)}<span className="caret" /></div>;
}

function Counter() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const e = now ? elapsed(START, now) : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return (
    <div className="counter">
      {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
        <div key={k} className="count-box"><b>{String(e[k]).padStart(k === "days" ? 1 : 2, "0")}</b><span>{k}</span></div>
      ))}
    </div>
  );
}

function MusicButton({ audio, playing, toggle }: { audio: boolean; playing: boolean; toggle: () => void }) {
  if (!audio) return null;
  return (
    <button className={`music ${playing ? "on" : ""}`} type="button" onClick={toggle} aria-label={playing ? "Pause music" : "Play music"}>
      <span className="bars"><i /><i /><i /><i /></span>
      <span className="music-t">{playing ? "Now playing" : "Paused"}<small>You're Gonna Live Forever in Me · John Mayer</small></span>
    </button>
  );
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [typed, setTyped] = useState(false);
  const [screen, setScreen] = useState<Screen>("envelope");
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    const a = audio.current; if (!a) return;
    a.volume = 0.35;
    a.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => setStarted(false));
  };
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) play(); else { a.pause(); setPlaying(false); } };

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    play();
    timers.current.push(setTimeout(() => setGone(true), 1500));
    timers.current.push(setTimeout(() => setScreen("letter"), 2300));
  };

  const floral = opened && (screen === "envelope" || screen === "letter");
  const go = (s: Screen) => () => setScreen(s);

  return (
    <>
      <audio ref={audio} src="/song.mp3" loop preload="auto" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      <MusicButton audio={started} playing={playing} toggle={toggle} />
      <FloralLayer on={floral} />

      <section className={`screen ${screen === "envelope" ? "active" : ""}`} id="s-envelope" aria-hidden={screen !== "envelope"}>
        <div className="env-stage">
          <div className={`env-wrap ${gone ? "gone" : ""}`}>
            <div className={`envelope ${opened ? "open" : ""}`} role="button" tabIndex={0} aria-label="Open the envelope" onClick={openEnvelope}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); } }}>
              <div className="env-back" />
              <div className="env-letter"><span>For you, Haris</span></div>
              <div className="env-front" />
              <div className="env-flap" />
              <div className="env-seal" aria-hidden="true">
                <svg viewBox="0 0 64 58">
                  <defs>
                    <radialGradient id="sealG" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#ffb3c8" /><stop offset="55%" stopColor="#e5698f" /><stop offset="100%" stopColor="#b23a62" />
                    </radialGradient>
                  </defs>
                  <path d="M32 56 C10 40 2 28 2 17 C2 8 9 2 17 2 C24 2 29 6 32 12 C35 6 40 2 47 2 C55 2 62 8 62 17 C62 28 54 40 32 56 Z" fill="url(#sealG)" />
                  <ellipse cx="19" cy="14" rx="7" ry="4" fill="#fff" opacity=".45" transform="rotate(-25 19 14)" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`env-hint ${opened ? "hidden" : ""}`}>Tap to open</div>
          <div className="float-hearts" aria-hidden="true">
            {[8, 22, 37, 55, 70, 84, 93].map((l, i) => (<span key={i} style={{ left: `${l}%`, fontSize: `${14 + (i % 3) * 8}px`, animationDuration: `${9 + (i % 4) * 2}s`, animationDelay: `${i * 1.3}s` }}>♥</span>))}
          </div>
        </div>
      </section>

      <section className={`screen ${screen === "letter" ? "active" : ""}`} id="s-letter" aria-hidden={screen !== "letter"}>
        <div className="letter-card">
          <div className="letter-inner">
            {screen === "letter" && <Typewriter text={LETTER} onDone={() => setTyped(true)} />}
            <p className={`letter-sign ${typed ? "show" : ""}`}>With all my love,<br />Me</p>
          </div>
          <button className={`btn-soft ${typed ? "show" : "hide"}`} type="button" onClick={go("lock")}>Next</button>
        </div>
      </section>

      <section className={`screen ${screen === "lock" ? "active" : ""}`} id="s-lock" aria-hidden={screen !== "lock"}>
        {screen === "lock" && <LockScreen onUnlock={go("time")} />}
      </section>

      <section className={`screen ${screen === "time" ? "active" : ""}`} id="s-time" aria-hidden={screen !== "time"}>
        <div className="sec">
          <p className="script">since 22 November 2025</p>
          <h2 className="sec-title">Our Time Together</h2>
          <Counter />
          <p className="sec-sub">and still counting, every second.</p>
          <button className="btn-soft show" type="button" onClick={go("story")}>Next</button>
        </div>
      </section>

      <section className={`screen ${screen === "story" ? "active" : ""}`} id="s-story" aria-hidden={screen !== "story"}>
        <div className="sec story">
          <p className="script">chapter by chapter</p>
          <h2 className="sec-title">Our Story</h2>
          <ol className="timeline">
            {MEMORIES.map((m, i) => (
              <li key={i} className={`mem ${i % 2 ? "r" : "l"}`} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                <figure className="polaroid" style={{ rotate: `${i % 2 ? 2.5 : -2.5}deg` }}>
                  {m.image ? <img src={m.image} alt={m.title} loading="lazy" /> : <div className="ph"><span>♥</span><small>photo coming soon</small></div>}
                  <figcaption>{m.date}</figcaption>
                </figure>
                <div className="mem-text"><h3>{m.title}</h3><p>{m.caption}</p></div>
              </li>
            ))}
          </ol>
          <button className="btn-soft show" type="button" onClick={go("spiral")}>Next</button>
        </div>
      </section>

      <section className={`screen ${screen === "spiral" ? "active" : ""}`} id="s-spiral" aria-hidden={screen !== "spiral"}>
        {screen === "spiral" && <LoveSpiral onDone={go("map")} />}
      </section>

      <section className={`screen ${screen === "map" ? "active" : ""}`} id="s-map" aria-hidden={screen !== "map"}>
        <LdrMap />
      </section>
    </>
  );
}

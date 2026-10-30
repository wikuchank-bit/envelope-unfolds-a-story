import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { LockScreen } from "@/components/LockScreen";
import loveCss from "../love.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For You" },
      { name: "description", content: "A sealed letter, written just for you." },
      { property: "og:title", content: "For You" },
      { property: "og:description", content: "A sealed letter, written just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: loveCss }],
  }),
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [screen, setScreen] = useState<"envelope" | "letter" | "lock">("envelope");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    // flap opens → letter slides out → envelope fades away, letter remains
    timer.current = setTimeout(() => setScreen("letter"), 1450);
  };

  return (
    <>
      <section className={`screen ${screen === "envelope" ? "active" : ""}`} id="s-envelope" aria-hidden={screen !== "envelope"}>
        <div className="env-stage">
          <div className="env-wrap">
            <div
              className={`envelope ${opened ? "open" : ""}`}
              role="button"
              tabIndex={0}
              aria-label="Open the envelope"
              onClick={openEnvelope}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
              }}
            >
              <div className="env-back" />
              <div className="env-letter"><span>For you</span></div>
              <div className="env-front" />
              <div className="env-flap" />
              <div className="env-seal" aria-hidden="true">
                <svg viewBox="0 0 64 58">
                  <defs>
                    <radialGradient id="sealG" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#ff8fb0" />
                      <stop offset="55%" stopColor="#e0245e" />
                      <stop offset="100%" stopColor="#8e1038" />
                    </radialGradient>
                  </defs>
                  <path d="M32 56 C10 40 2 28 2 17 C2 8 9 2 17 2 C24 2 29 6 32 12 C35 6 40 2 47 2 C55 2 62 8 62 17 C62 28 54 40 32 56 Z" fill="url(#sealG)" />
                  <ellipse cx="19" cy="14" rx="7" ry="4" fill="#fff" opacity=".45" transform="rotate(-25 19 14)" />
                </svg>
              </div>
            </div>
          </div>
          <div className="env-hint">Tap to open</div>
          <div className="float-hearts" aria-hidden="true">
            {[8,22,37,55,70,84,93].map((l,i)=>(<span key={i} style={{left:`${l}%`,fontSize:`${14+(i%3)*8}px`,animationDuration:`${9+(i%4)*2}s`,animationDelay:`${i*1.3}s`}}>♥</span>))}
          </div>
        </div>
      </section>

      <section className={`screen ${screen === "letter" ? "active" : ""}`} id="s-letter" aria-hidden={screen !== "letter"}>
        <div className="letter-card">
          <div className="letter-inner">
            <h2>My Haris,</h2>
            <p>
              There are a thousand things I could write here, and somehow none of them
              feel big enough. So I'll start with the simplest one: I'm glad it's you.
            </p>
            <p>
              Every ordinary day turns a little less ordinary when you're in it. Thank you
              for the small things — the way you laugh mid-sentence, the way you remember
              the details, the way you make everywhere feel like somewhere I belong.
            </p>
            <p>
              There's one more thing waiting for you. But it's locked. And I think you
              already know the code.
            </p>
            <p className="letter-sign">Always,<br />Me</p>
          </div>
          <button className="btn-continue" type="button" onClick={() => setScreen("lock")}>Continue</button>
        </div>
      </section>

      <section className={`screen ${screen === "lock" ? "active" : ""}`} id="s-lock" aria-hidden={screen !== "lock"}>
        <LockScreen />
      </section>
    </>
  );
}

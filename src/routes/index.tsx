import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
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
  const [screen, setScreen] = useState<"envelope" | "letter">("envelope");
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
              <div className="env-seal">♥</div>
            </div>
          </div>
          <div className="env-hint">Tap to open</div>
        </div>
      </section>

      <section className={`screen ${screen === "letter" ? "active" : ""}`} id="s-letter" aria-hidden={screen !== "letter"}>
        <div className="letter-card">
          <div className="letter-inner">
            <h2>My Dearest,</h2>
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
          <button className="btn-continue" type="button">Continue</button>
        </div>
      </section>
    </>
  );
}

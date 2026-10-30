import { useEffect, useState } from "react";

export const PASSCODE = "221125";

export function checkPasscode(code: string) {
  return code === PASSCODE;
}

const KEYS: [string, string][] = [
  ["1", ""], ["2", "ABC"], ["3", "DEF"],
  ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
  ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
];

const WALL: [number, number, number, number, string][] = [
  [8, 12, 9, -15, "♥"], [78, 9, 7, 20, "💗"], [55, 22, 5, 0, "✦"], [15, 40, 6, 10, "🌸"], [85, 38, 10, -10, "♥"],
  [40, 55, 5, 15, "✨"], [10, 68, 11, 12, "💕"], [72, 62, 6, -20, "🌷"], [30, 82, 7, -8, "♥"], [80, 84, 8, 18, "💖"],
  [52, 74, 4, 0, "✦"], [25, 25, 4, 0, "✦"], [62, 45, 7, 25, "♥"],
];

export function LockScreen({ onUnlock, onCorrect }: { onUnlock?: () => void; onCorrect?: () => void }) {
  const [now, setNow] = useState<Date | null>(null);
  const [mode, setMode] = useState<"lock" | "code" | "open">("lock");
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const press = (d: string) => {
    if (code.length >= 6 || mode !== "code") return;
    const next = code + d;
    setCode(next);
    if (next.length === 6) {
      setTimeout(() => {
        if (checkPasscode(next)) {
          setMode("open");
          onCorrect?.();
          setTimeout(() => onUnlock?.(), 3000);
        } else {
          setShake(true);
          setTimeout(() => { setShake(false); setCode(""); }, 500);
        }
      }, 150);
    }
  };

  const time = now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false }) : "";
  const date = now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "";

  return (
    <div className="iphone">
      <div className="iphone-btn b1" /><div className="iphone-btn b2" /><div className="iphone-btn b3" /><div className="iphone-btn b4" />
      <div className="iphone-screen">
        <div className={`ls-wall ${mode !== "lock" ? "blur" : ""}`}>
          {WALL.map((h, i) => <span key={i} style={{ left: `${h[0]}%`, top: `${h[1]}%`, fontSize: `${h[2]}cqw`, rotate: `${h[3]}deg`, animationDelay: `${i * 0.3}s` }}>{h[4]}</span>)}
        </div>
        <div className="ls-status">
          <span>{time}</span>
          <span className="ls-icons">
            <svg viewBox="0 0 18 12" width="17"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
            <svg viewBox="0 0 16 12" width="15"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.5 6.9a6.3 6.3 0 0 1 9 0l-1.4 1.4a4.3 4.3 0 0 0-6.2 0zM1.3 4.7a9.4 9.4 0 0 1 13.4 0L13.3 6a7.4 7.4 0 0 0-10.6 0z"/></svg>
            <span className="ls-batt"><i /></span>
          </span>
        </div>
        <div className="iphone-island" />

        {mode === "lock" && (
          <div className="ls-main" onClick={() => setMode("code")}>
            <div className="ls-lock">
              <svg viewBox="0 0 24 24" width="16"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>
            </div>
            <div className="ls-date">{date}</div>
            <div className="ls-time">{time}</div>
            <div className="ls-notif">
              <div className="ls-notif-ic">♥</div>
              <div><b>Messages</b><p>Something's waiting for you… unlock to see 💌</p></div>
            </div>
            <div className="ls-bottom">
              <span className="ls-round"><svg viewBox="0 0 24 24" width="18"><path d="M9 2h6l-1 6h3l-7 14 1-9H8z"/></svg></span>
              <span className="ls-round"><svg viewBox="0 0 24 24" width="18"><path d="M4 7h3l2-3h6l2 3h3v13H4zm8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg></span>
            </div>
            <div className="ls-swipe">Tap to unlock</div>
            <div className="ls-home" />
          </div>
        )}

        {mode === "code" && (
          <div className="ls-pad">
            <div className="ls-pad-title">Enter Passcode</div>
            <div className={`ls-dots ${shake ? "shake" : ""}`}>
              {Array.from({ length: 6 }).map((_, i) => <span key={i} className={i < code.length ? "on" : ""} />)}
            </div>
            <div className="ls-keys">
              {KEYS.map(([n, l]) => (
                <button key={n} type="button" className="hk" onClick={() => press(n)}><b>{n}</b><small>{l}</small></button>
              ))}
              <span />
              <button type="button" className="hk" onClick={() => press("0")}><b>0</b><small /></button>
              <span />
            </div>
            <div className="ls-pad-foot">
              <button type="button" onClick={() => { setMode("lock"); setCode(""); }}>Emergency</button>
              <button type="button" onClick={() => code ? setCode(code.slice(0, -1)) : setMode("lock")}>{code ? "Delete" : "Cancel"}</button>
            </div>
            <div className="ls-home" />
          </div>
        )}

        {mode === "open" && (
          <div className="ls-open">
            <div className="ls-open-heart">♥</div>
            <p>Unlocked</p>
          </div>
        )}
      </div>
    </div>
  );
}

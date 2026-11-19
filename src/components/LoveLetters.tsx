import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, Flower2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOVE_LETTERS } from "@/lib/memoryBook";

export function LoveLetters({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const close = () => setClosing(true);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => { setSelected(null); setClosing(false); trigger.current?.focus(); }, 450);
    return () => clearTimeout(timer);
  }, [closing]);
  useEffect(() => {
    if (selected === null) return;
    closeButton.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { e.preventDefault(); closeButton.current?.focus(); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [selected]);
  const letter = selected === null ? null : LOVE_LETTERS[selected];
  return <div className="love-letters-wrap">
    <p className="script">written from the heart</p><h2 className="sec-title">Letters for You</h2>
    <div className="letters-collection">
      {LOVE_LETTERS.map((item, i) => <Button key={item.id} variant="ghost" className={`letter-envelope ${selected === i ? "letter-envelope-open" : ""}`} aria-label={`Open letter: ${item.title}`} onClick={(e) => { trigger.current = e.currentTarget; setSelected(i); }}>
        <span className="letter-envelope-paper" /><span className="letter-envelope-front" /><span className="letter-envelope-flap" /><span className="letter-wax"><Heart /></span><span className="letter-envelope-to">For my Haris</span><Flower2 className="letter-envelope-flower" />
        <span className="letter-envelope-title">{item.title}</span>
      </Button>)}
      {[1, 2].map((n) => <div key={n} className={`future-envelope future-envelope-${n}`} aria-hidden="true"><span className="letter-envelope-front" /><span className="letter-envelope-flap" /><span className="letter-wax"><Heart /></span></div>)}
    </div>
    <Button variant="ghost" className="romantic-control" onClick={onBack}><ArrowLeft />Under the stars</Button>
    {letter && <div className={`letter-modal ${closing ? "letter-modal-closing" : ""}`} onClick={close}>
      <article className="personal-letter" role="dialog" aria-modal="true" aria-labelledby="personal-letter-title" onClick={(e) => e.stopPropagation()}>
        <Button ref={closeButton} variant="ghost" size="icon" className="personal-letter-close" aria-label="Close letter" onClick={close}><X /></Button>
        <Flower2 className="personal-letter-flower" aria-hidden="true" />
        <p className="personal-letter-to">My Haris,</p><h3 id="personal-letter-title">{letter.title}</h3>
        <div className="personal-letter-text">{letter.text.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="personal-letter-sign"><Heart aria-hidden="true" /><span>With all my love,<br />Me</span></div>
      </article>
    </div>}
  </div>;
}
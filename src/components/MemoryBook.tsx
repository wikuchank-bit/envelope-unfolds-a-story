import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, BookHeart, Heart, Flower2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOK_PAGES } from "@/lib/memoryBook";

type Motion = "closed" | "opening" | "open" | "forward" | "backward" | "closing";

export function MemoryBook({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<HTMLElement[]>([]);
  const [page, setPage] = useState(0);
  const [motion, setMotion] = useState<Motion>("closed");
  const [zoom, setZoom] = useState<string | null>(null);
  const state = useRef({ motion: "closed" as Motion, started: 0 });
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    state.current = { motion, started: performance.now() };
    if (motion === "closed" || motion === "open") return;
    const duration = motion === "closing" ? 2100 : motion === "opening" ? 1500 : 950;
    const timer = setTimeout(() => {
      if (motion === "closing") { done.current(); return; }
      if (motion === "forward") setPage((p) => Math.min(BOOK_PAGES.length - 1, p + 1));
      if (motion === "backward") setPage((p) => Math.max(0, p - 1));
      setMotion("open");
    }, duration);
    return () => clearTimeout(timer);
  }, [motion]);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const mount = host.current;
    if (!mount) return;
    Promise.all([import("three"), import("three/addons/renderers/CSS3DRenderer.js")]).then(([THREE, { CSS3DRenderer, CSS3DObject }]) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 1, 5000);
      const renderer = new CSS3DRenderer();
      renderer.domElement.className = "book-renderer";
      mount.appendChild(renderer.domElement);
      const book = new THREE.Group();
      scene.add(book);
      const elements = Array.from({ length: 4 }, (_, i) => {
        const el = document.createElement("div");
        el.className = `book-sheet book-sheet-${i}`;
        return el;
      });
      const left = new CSS3DObject(elements[0] as HTMLElement);
      left.position.set(-180, 0, 0);
      const right = new CSS3DObject(elements[1] as HTMLElement);
      right.position.set(180, 0, 1);
      book.add(left, right);
      const coverPivot = new THREE.Group();
      const cover = new CSS3DObject(elements[2] as HTMLElement);
      cover.position.set(180, 0, 5);
      coverPivot.add(cover); book.add(coverPivot);
      const turnPivot = new THREE.Group();
      const turn = new CSS3DObject(elements[3] as HTMLElement);
      turn.position.set(180, 0, 9);
      turnPivot.add(turn); book.add(turnPivot);
      setTargets(elements);
      let mobile = false;
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        mobile = w < 600;
        renderer.setSize(w, h); camera.aspect = w / h;
        const span = mobile ? 390 : 800;
        camera.position.z = Math.max(540 / (2 * Math.tan(35 * Math.PI / 360)), span / (2 * Math.tan(35 * Math.PI / 360) * camera.aspect));
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize); observer.observe(mount); resize();
      let raf = 0;
      const animate = (now: number) => {
        const s = state.current;
        const duration = s.motion === "closing" ? 1500 : s.motion === "opening" ? 1500 : 950;
        const p = Math.min(1, Math.max(0, (now - s.started) / duration));
        const eased = p * p * (3 - 2 * p);
        const openness = s.motion === "closed" ? 0 : s.motion === "opening" ? eased : s.motion === "closing" ? 1 - eased : 1;
        coverPivot.rotation.y = -Math.PI * openness;
        cover.element.style.visibility = s.motion === "open" || s.motion === "forward" || s.motion === "backward" ? "hidden" : "visible";
        left.element.style.visibility = mobile ? "hidden" : "visible";
        book.position.x = mobile ? -180 : -180 * (1 - openness);
        book.rotation.x = -0.035; book.rotation.y = 0.025;
        const turning = s.motion === "forward" || s.motion === "backward";
        turn.element.style.visibility = turning ? "visible" : "hidden";
        turnPivot.rotation.y = s.motion === "backward" ? -Math.PI * (1 - eased) : -Math.PI * eased;
        mount.style.opacity = s.motion === "closing" ? String(1 - Math.max(0, (now - s.started - 1500) / 600)) : "1";
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      cleanup = () => { cancelAnimationFrame(raf); observer.disconnect(); renderer.domElement.remove(); };
    });
    return () => { disposed = true; cleanup(); };
  }, []);
  useEffect(() => {
    if (!zoom) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setZoom(null); };
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, [zoom]);
  const current = BOOK_PAGES[page];
  const turningPage = BOOK_PAGES[motion === "backward" ? Math.max(0, page - 1) : page];
  const spread = (entry: typeof current, turning = false) => entry && <div className={`scrap-page ${entry.photos.length === 0 ? "scrap-final" : ""}`}>
    <span className="scrap-eyebrow">little pieces of us</span>
    <div className={`scrap-photos ${entry.photos.length > 1 ? "scrap-pair" : ""}`}>
      {entry.photos.map((url, i) => <Button key={url} variant="ghost" className="scrap-photo" onClick={() => !turning && setZoom(url)} aria-label={`Enlarge memory ${page + 1}, photo ${i + 1}`} tabIndex={turning ? -1 : 0}>
        <img src={url} alt={`A little moment together, memory ${page + 1}`} /><span aria-hidden="true" className="scrap-tape" />
      </Button>)}
    </div>
    {entry.photos.length === 0 && <Heart className="scrap-final-heart" aria-hidden="true" />}
    <p className="scrap-note">{entry.note}</p>
    <div className="scrap-footer"><Flower2 aria-hidden="true" /><span>{page + 1} / {BOOK_PAGES.length}</span><Heart aria-hidden="true" /></div>
  </div>;
  return <div className={`memory-book-wrap motion-${motion}`}>
    <p className="script">every little moment, kept close</p><h2 className="sec-title">Our Little Storybook</h2>
    <div ref={host} className="book-stage" aria-label="Interactive 3D memory book" />
    {targets[0] && createPortal(<div className="book-dedication"><Flower2 /><p>For you,<br /><span>Haris</span></p><div className="book-ribbon" /><p className="book-dedication-small">You & me.<br />And all the little things in between.</p><Heart /></div>, targets[0])}
    {targets[1] && createPortal(spread(current), targets[1])}
    {targets[2] && createPortal(<Button variant="ghost" className="book-cover" onClick={() => motion === "closed" && setMotion("opening")} aria-label="Open our memory book" disabled={motion !== "closed"}><Flower2 /><span className="book-cover-small">a story worth keeping</span><span className="book-cover-title">Our<br />little story</span><Heart /><span className="book-cover-names">Haris & me</span><span className="book-cover-date">22 November 2025</span></Button>, targets[2])}
    {targets[3] && createPortal(spread(turningPage, true), targets[3])}
    <div className="book-controls">
      <Button variant="ghost" className="romantic-control" onClick={onBack} disabled={motion !== "closed" && motion !== "open"}><ArrowLeft />Back</Button>
      {motion === "closed" ? <Button variant="ghost" className="romantic-control romantic-primary" onClick={() => setMotion("opening")}><BookHeart />Open book</Button> : <>
        <Button variant="ghost" size="icon" className="romantic-control" aria-label="Previous page" title="Previous page" disabled={page === 0 || motion !== "open"} onClick={() => setMotion("backward")}><ArrowLeft /></Button>
        <span className="book-page-count" aria-live="polite">{page + 1} / {BOOK_PAGES.length}</span>
        {page < BOOK_PAGES.length - 1 ? <Button variant="ghost" size="icon" className="romantic-control" aria-label="Next page" title="Next page" disabled={motion !== "open"} onClick={() => setMotion("forward")}><ArrowRight /></Button> : <Button variant="ghost" className="romantic-control romantic-primary" disabled={motion !== "open"} onClick={() => setMotion("closing")}><BookHeart />Close book</Button>}
      </>}
    </div>
    {zoom && <div className="book-lightbox" role="dialog" aria-modal="true" aria-label="Memory photo" onClick={() => setZoom(null)}><img src={zoom} alt="Our memory, enlarged" onClick={(e) => e.stopPropagation()} /><Button autoFocus variant="ghost" size="icon" className="book-lightbox-close" aria-label="Close memory photo" onClick={() => setZoom(null)}><X /></Button></div>}
  </div>;
}
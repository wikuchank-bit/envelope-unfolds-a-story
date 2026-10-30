# Envelope Unfolds A Story

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>For You</title>
<style>
  /* ============ BASE ============ */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: #0a0714;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
                 "Helvetica Neue", "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* ============ SCREEN SYSTEM ============ */
  .screen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity .65s ease, visibility .65s ease;
    -webkit-overflow-scrolling: touch;
  }
  .screen > * { margin: auto; }
  .screen.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* =================================================
     1. ENVELOPE
     ================================================= */
  #s-envelope {
    background: radial-gradient(120% 90% at 50% 0%, #142b4a 0%, #0a1428 55%, #04070e 100%);
  }

  .env-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 34px;
    padding: 40px 20px;
  }

  .env-wrap { perspective: 1400px; }

  .envelope {
    position: relative;
    width: min(84vw, 380px);
    aspect-ratio: 1.55 / 1;
    cursor: pointer;
    filter: drop-shadow(0 30px 50px rgba(0,0,0,.55));
    transition: transform .5s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .envelope:hover { transform: translateY(-4px); }
  .envelope.open { cursor: default; transform: none; }

  .env-back,
  .env-front,
  .env-flap {
    position: absolute;
    inset: 0;
    border-radius: 8px;
  }

  .env-back {
    z-index: 1;
    background: linear-gradient(160deg, #b8cce0 0%, #93aec9 55%, #6e8aa8 100%);
  }

  .env-letter {
    position: absolute;
    left: 5%;
    width: 90%;
    top: 6%;
    height: 88%;
    z-index: 2;
    background: linear-gradient(180deg, #f8fbff 0%, #e8f0f8 100%);
    border-radius: 4px;
    box-shadow: 0 4px 18px rgba(0,0,0,.22);
    transition: transform .85s cubic-bezier(.34,1.2,.4,1);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .env-letter span {
    font-size: 13px;
    letter-spacing: .06em;
    color: #7a93ad;
    font-style: italic;
  }

  .env-front {
    z-index: 3;
    clip-path: polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%);
    background: linear-gradient(180deg, #c4d8ec 0%, #a0bcd8 100%);
    border-radius: 8px;
    box-shadow: inset 0 2px 0 rgba(255,255,255,.4);
  }

  .env-flap {
    z-index: 4;
    height: 60%;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    background: linear-gradient(180deg, #d0e2f4 0%, #aec8e0 100%);
    transform-origin: top center;
    transform-style: preserve-3d;
    transition: transform .75s cubic-bezier(.5,0,.2,1), z-index 0s .35s;
    border-radius: 8px 8px 0 0;
  }

  .env-seal {
    position: absolute;
    top: 60%;
    left: 50%;
    z-index: 5;
    width: 46px;
    height: 46px;
    margin: -23px 0 0 -23px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #4a7aaa, #1e3d60 70%);
    box-shadow: 0 4px 12px rgba(20,50,90,.45), inset 0 -2px 6px rgba(0,0,0,.25);
    display: grid;
    place-items: center;
    color: #dce8f4;
    font-size: 18px;
    transition: opacity .35s, transform .35s;
  }

  /* --- opened state --- */
  .envelope.open .env-flap {
    transform: rotateX(180deg);
    z-index: 0;
  }
  .envelope.open .env-seal {
    opacity: 0;
    transform: scale(.5);
  }
  .envelope.open .env-letter {
    transform: translateY(-118%);
  }

  .env-hint {
    font-size: 12px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: rgba(255,255,255,.42);
    animation: pulse 2.4s ease-in-out infinite;
  }
  .envelope.open ~ .env-hint { opacity: 0; transition: opacity .4s; }
  @keyframes pulse {
    0%, 100% { opacity: .35; }
    50%      { opacity: .85; }
  }

  /* =================================================
     2. LETTER
     ================================================= */
  #s-letter {
    background: radial-gradient(120% 90% at 50% 0%, #1a3050 0%, #0c1628 55%, #04070e 100%);
    padding: 28px 18px;
  }

  .letter-card {
    width: min(94vw, 540px);
    background: linear-gradient(180deg, #f8fbff 0%, #e6eff8 100%);
    border-radius: 10px;
    padding: clamp(26px, 6vw, 44px);
    box-shadow:
      0 40px 80px -20px rgba(0,0,0,.7),
      0 0 0 1px rgba(255,255,255,.06);
    position: relative;
  }
  .letter-card::before {
    content: "";
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(100,140,180,.28);
    border-radius: 4px;
    pointer-events: none;
  }

  .letter-inner {
    font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
    color: #1e2c3a;
    font-size: clamp(15px, 4.2vw, 17px);
    line-height: 1.85;
  }
  .letter-inner h2 {
    font-family: Georgia, serif;
    font-size: clamp(22px, 6vw, 28px);
    font-weight: 400;
    letter-spacing: .01em;
    color: #16202c;
    margin-bottom: 20px;
  }
  .letter-inner p { margin-bottom: 16px; }
  .letter-inner p:last-of-type { margin-bottom: 24px; }
  .letter-sign {
    font-style: italic;
    color: #4a627a;
    text-align: right;
  }

  .btn-continue {
    display: block;
    margin: 30px auto 0;
    padding: 14px 40px;
    border: none;
    border-radius: 999px;
    background: linear-gradient(135deg, #2c5a8a, #1a3a5c);
    color: #eaf2fa;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 12px 28px -8px rgba(30,60,100,.7);
    transition: transform .2s, box-shadow .2s;
  }
  .btn-continue:hover  { transform: translateY(-2px); box-shadow: 0 16px 34px -8px rgba(30,60,100,.85); }
  .btn-continue:active { transform: translateY(0) scale(.97); }

  /* =================================================
     3. iPHONE FRAME
     ================================================= */
  #s-lock {
    overflow: hidden;
    position: fixed;
    inset: 0;
    background: #060a12;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .75s cubic-bezier(.4,0,.2,1), opacity .75s ease,
                visibility .75s ease;
    touch-action: manipulation;
  }
  #s-lock.unlocked {
    transform: scale(1.18);
    opacity: 0;
    pointer-events: none;
  }

  /* --- iPhone outer frame --- */
  .iphone-frame {
    position: relative;
    width: min(92vw, 390px);
    aspect-ratio: 9 / 19.5;
    border-radius: 54px;
    padding: 12px;
    background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #111114 100%);
    box-shadow:
      0 0 0 2px #3a3a40,
      0 0 0 4px #1a1a1e,
      0 30px 80px -10px rgba(0,0,0,.9),
      0 0 120px -20px rgba(30,80,140,.25),
      inset 0 1px 2px rgba(255,255,255,.08);
  }

  /* notch / dynamic island */
  .iphone-frame::before {
    content: "";
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 34px;
    background: #000;
    border-radius: 20px;
    z-index: 10;
    box-shadow: inset 0 0 6px rgba(255,255,255,.06);
  }

  /* side buttons */
  .iphone-frame::after {
    content: "";
    position: absolute;
    right: -3px;
    top: 160px;
    width: 3px;
    height: 64px;
    background: linear-gradient(180deg, #3a3a40, #1a1a1e);
    border-radius: 0 2px 2px 0;
  }

  .iphone-screen {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 44px;
    overflow: hidden;
    background: #000;
    color: #fff;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* --- wallpaper --- */
  .ls-wallpaper {
    position: absolute;
    inset: -10%;
    background:
      radial-gradient(70% 55% at 18% 12%, #1e3a6a 0%, transparent 62%),
      radial-gradient(60% 50% at 86% 18%, #2a4a80 0%, transparent 60%),
      radial-gradient(80% 60% at 50% 108%, #0e2444 0%, transparent 62%),
      linear-gradient(170deg, #0a1428 0%, #122a4a 42%, #060a12 100%);
    filter: saturate(1.1);
  }
  .ls-wallpaper::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%);
  }

  .ls-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 44px 0 10px;
  }

  /* --- status bar --- */
  .ls-status {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    padding: 0 26px;
    height: 24px;
    color: #fff;
  }
  .ls-bars { display: flex; align-items: flex-end; gap: 2px; height: 11px; }
  .ls-bars i {
    display: block;
    width: 3px;
    border-radius: 1px;
    background: currentColor;
  }
  .ls-bars i:nth-child(1) { height: 4px; }
  .ls-bars i:nth-child(2) { height: 6px; }
  .ls-bars i:nth-child(3) { height: 8px; }
  .ls-bars i:nth-child(4) { height: 11px; }

  /* --- clock block --- */
  .ls-clock-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: clamp(28px, 7vh, 60px);
  }
  .ls-lockicon {
    width: 20px;
    height: 20px;
    margin-bottom: 14px;
    opacity: .95;
  }
  .ls-date {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: .01em;
    opacity: .95;
    margin-bottom: 2px;
  }
  .ls-time {
    font-size: clamp(60px, 19vw, 96px);
    font-weight: 600;
    line-height: .95;
    letter-spacing: -0.035em;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 2px 24px rgba(0,0,0,.28);
  }

  /* --- bottom controls --- */
  .ls-bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px 14px;
  }
  .ls-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,.16);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    color: #fff;
    cursor: pointer;
    transition: background .18s, transform .12s;
  }
  .ls-circle:active { background: rgba(255,255,255,.34); transform: scale(.94); }

  .ls-homebar {
    width: 132px;
    height: 5px;
    border-radius: 3px;
    background: rgba(255,255,255,.85);
    margin: 0 auto 8px;
  }

  /* =================================================
     4. PASSCODE LAYER
     ================================================= */
  .pc-layer {
    position: absolute;
    inset: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0 26px;
    background: rgba(8,14,26,.42);
    backdrop-filter: blur(34px) saturate(130%);
    -webkit-backdrop-filter: blur(34px) saturate(130%);
    opacity: 0;
    visibility: hidden;
    transition: opacity .38s ease, visibility .38s ease;
  }
  .pc-layer.show { opacity: 1; visibility: visible; }

  .pc-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    margin-top: clamp(18px, 8vh, 70px);
    transition: transform .5s cubic-bezier(.34,1.2,.4,1), opacity .4s;
  }
  .pc-layer.entered .pc-head {
    transform: translateY(-14px);
    opacity: 0;
    pointer-events: none;
  }

  .pc-lockicon { width: 22px; height: 22px; opacity: .95; }

  .pc-title {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: .01em;
  }

  .pc-dots {
    display: flex;
    gap: 20px;
    margin-top: 26px;
    transition: opacity .4s;
  }
  .pc-dots.hide { opacity: 0; }

  .pc-dot {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,.9);
    transition: background .14s ease, transform .14s ease;
  }
  .pc-dot.filled {
    background: #fff;
    transform: scale(1.06);
  }

  @keyframes pc-shake {
    0%, 100% { transform: translateX(0); }
    14% { transform: translateX(-13px); }
    28% { transform: translateX(12px); }
    42% { transform: translateX(-9px); }
    56% { transform: translateX(8px); }
    70% { transform: translateX(-5px); }
    84% { transform: translateX(3px); }
  }
  .pc-dots.shake { animation: pc-shake .52s cubic-bezier(.36,.07,.19,.97); }

  .pc-pad {
    display: grid;
    grid-template-columns: repeat(3, 72px);
    gap: clamp(14px, 3.2vh, 26px) 24px;
    margin-top: auto;
    justify-content: center;
  }

  .pc-key {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,.14);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #fff;
    font-family: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    cursor: pointer;
    transition: background .14s ease, transform .1s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .pc-key:active { background: rgba(255,255,255,.4); transform: scale(.94); }
  .pc-key .num {
    font-size: 31px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: .5px;
  }
  .pc-key .sub {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 2.2px;
    opacity: .9;
    margin-top: 2px;
  }
  .pc-key.spacer {
    background: transparent;
    pointer-events: none;
  }
  .pc-key.del { background: rgba(255,255,255,0); }
  .pc-key.del:active { background: rgba(255,255,255,.28); }

  @media (max-height: 700px) {
    .pc-pad { grid-template-columns: repeat(3, 62px); gap: 12px 20px; }
    .pc-key { width: 62px; height: 62px; }
    .pc-key .num { font-size: 26px; }
    .pc-head { margin-top: 8px; }
    .ls-time { font-size: clamp(48px, 16vw, 76px); }
  }

  /* =================================================
     5. UNLOCKED / FINAL SCREEN
     ================================================= */
  #s-unlocked {
    background: radial-gradient(120% 90% at 50% 15%, #1a2e4a 0%, #0e1a2e 55%, #04070c 100%);
    color: #e8f0fa;
    text-align: center;
    padding: 32px 22px;
  }
  .final-inner { max-width: 460px; }
  .final-heart {
    font-size: 54px;
    line-height: 1;
    margin-bottom: 22px;
    animation: beat 1.9s ease-in-out infinite;
    filter: drop-shadow(0 8px 22px rgba(40,100,180,.55));
  }
  @keyframes beat {
    0%, 100% { transform: scale(1); }
    18%      { transform: scale(1.14); }
    36%      { transform: scale(1); }
  }
  .final-inner h1 {
    font-family: Georgia, "Iowan Old Style", serif;
    font-size: clamp(26px, 7vw, 34px);
    font-weight: 400;
    margin-bottom: 16px;
    letter-spacing: .01em;
  }
  .final-inner p {
    font-size: 15.5px;
    line-height: 1.85;
    color: rgba(220,235,255,.72);
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
</style>
</head>
<body>

<!-- ============ SCREEN 1: ENVELOPE ============ -->
<section class="screen active" id="s-envelope">
  <div class="env-stage">
    <div class="env-wrap">
      <div class="envelope" id="envelope" role="button" tabindex="0" aria-label="Open the envelope">
        <div class="env-back"></div>
        <div class="env-letter"><span>For you</span></div>
        <div class="env-front"></div>
        <div class="env-flap"></div>
        <div class="env-seal">♥</div>
      </div>
    </div>
    <div class="env-hint" id="envHint">Tap to open</div>
  </div>
</section>

<!-- ============ SCREEN 2: LETTER ============ -->
<section class="screen" id="s-letter">
  <div class="letter-card">
    <div class="letter-inner">
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
      <p class="letter-sign">Always,<br>Me</p>
    </div>
    <button class="btn-continue" id="btnContinue">Continue</button>
  </div>
</section>

<!-- ============ SCREEN 3: iPHONE LOCK SCREEN ============ -->
<section class="screen" id="s-lock">

  <div class="iphone-frame">
    <div class="iphone-screen">

      <div class="ls-wallpaper"></div>

      <div class="ls-content">

        <!-- status bar -->
        <div class="ls-status">
          <div class="ls-bars"><i></i><i></i><i></i><i></i></div>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path d="M1.4 4.1a9.6 9.6 0 0 1 13.2 0"/>
            <path d="M3.9 6.7a6 6 0 0 1 8.2 0"/>
            <path d="M6.4 9.3a2.4 2.4 0 0 1 3.2 0"/>
          </svg>
          <svg width="26" height="13" viewBox="0 0 26 13">
            <rect x="0.6" y="0.6" width="21.8" height="11.8" rx="3.6"
                  fill="none" stroke="currentColor" stroke-opacity=".42"/>
            <rect x="2.1" y="2.1" width="17.4" height="8.8" rx="2.1" fill="currentColor"/>
            <path d="M24.2 4.4v4.2a2.2 2.2 0 0 0 0-4.2Z" fill="currentColor" fill-opacity=".42"/>
          </svg>
        </div>

        <!-- clock -->
        <div class="ls-clock-area">
          <svg class="ls-lockicon" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.6"/>
            <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9"/>
          </svg>
          <div class="ls-date" id="lsDate">Monday, June 9</div>
          <div class="ls-time" id="lsTime">9:41</div>
        </div>

        <!-- bottom controls -->
        <div class="ls-bottom">
          <button class="ls-circle" aria-label="Flashlight">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 2h8v3.2l-2.4 3.4v12.6a1.6 1.6 0 0 1-3.2 0V8.6L8 5.2V2Zm2 8.4v9.4a.6.6 0 0 0 1.2 0V10.4H10Z"/>
            </svg>
          </button>
          <button class="ls-circle" aria-label="Camera">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
              <path d="M3 8.6h3.2l1.6-2.4h8.4l1.6 2.4H21v10.6H3V8.6Z"/>
              <circle cx="12" cy="13.6" r="3.6"/>
            </svg>
          </button>
        </div>

        <div class="ls-homebar"></div>
      </div>

      <!-- ---------- passcode layer ---------- -->
      <div class="pc-layer" id="pcLayer">
        <div class="pc-head">
          <svg class="pc-lockicon" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.6"/>
            <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9"/>
          </svg>
          <div class="pc-title" id="pcTitle">Enter Passcode</div>
        </div>

        <div class="pc-dots" id="pcDots"></div>
        <div class="pc-pad" id="pcPad"></div>
      </div>

    </div>
  </div>

</section>

<!-- ============ SCREEN 4: UNLOCKED ============ -->
<section class="screen" id="s-unlocked">
  <div class="final-inner">
    <div class="final-heart">♥</div>
    <h1>You're in.</h1>
    <p>I knew you'd get it.</p>
  </div>
</section>

<script>
/* =========================================================
   ⚙️  CONFIG — SET YOUR PASSCODE HERE
   ========================================================= */
const PASSCODE = "1234";   // ← CHANGE THIS. Works with any length (4, 6, …)

/* =========================================================
   SCREEN ROUTER
   ========================================================= */
const screens = {
  envelope: document.getElementById('s-envelope'),
  letter:   document.getElementById('s-letter'),
  lock:     document.getElementById('s-lock'),
  unlocked: document.getElementById('s-unlocked')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

/* =========================================================
   1. ENVELOPE → LETTER
   ========================================================= */
const envelope = document.getElementById('envelope');
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  envelope.classList.add('open');

  // flap opens (0–750ms) → letter slides out (~400–1250ms) → go to letter
  setTimeout(() => showScreen('letter'), 1450);
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
});

/* =========================================================
   2. LETTER → LOCK SCREEN
   ========================================================= */
document.getElementById('btnContinue').addEventListener('click', () => {
  showScreen('lock');
  // small delay so the lock screen settles before the passcode UI slides in
  setTimeout(() => {
    pcLayer.classList.add('show');
  }, 550);
});

/* =========================================================
   3. LIVE CLOCK (lock screen)
   ========================================================= */
const lsTime = document.getElementById('lsTime');
const lsDate = document.getElementById('lsDate');

function tickClock() {
  const now = new Date();

  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  h = h % 12 || 12;
  lsTime.textContent = `${h}:${m}`;

  lsDate.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}
tickClock();
setInterval(tickClock, 1000);

/* =========================================================
   4. PASSCODE
   ========================================================= */
const pcLayer = document.getElementById('pcLayer');
const pcDots  = document.getElementById('pcDots');
const pcPad   = document.getElementById('pcPad');
const pcTitle = document.getElementById('pcTitle');

const CODE_LENGTH = PASSCODE.length;
let entered = "";

/* -- build dots -- */
for (let i = 0; i < CODE_LENGTH; i++) {
  const d = document.createElement('div');
  d.className = 'pc-dot';
  pcDots.appendChild(d);
}
const dotEls = [...pcDots.children];

/* -- build keypad -- */
const KEYS = [
  { n: '1' },
  { n: '2', s: 'ABC' },
  { n: '3', s: 'DEF' },
  { n: '4', s: 'GHI' },
  { n: '5', s: 'JKL' },
  { n: '6', s: 'MNO' },
  { n: '7', s: 'PQRS' },
  { n: '8', s: 'TUV' },
  { n: '9', s: 'WXYZ' },
  { spacer: true },
  { n: '0' },
  { del: true }
];

KEYS.forEach(k => {
  const b = document.createElement('button');
  b.type = 'button';

  if (k.spacer) {
    b.className = 'pc-key spacer';
    b.disabled = true;
  } else if (k.del) {
    b.className = 'pc-key del';
    b.innerHTML = `
      <svg width="27" height="20" viewBox="0 0 27 20" fill="none"
           stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.4 2h15.2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8.4L1.8 10 8.4 2Z"/>
        <path d="M12.6 7.4l6 5.2M18.6 7.4l-6 5.2"/>
      </svg>`;
    b.setAttribute('aria-label', 'Delete');
    b.addEventListener('click', () => { entered = entered.slice(0, -1); paintDots(); });
  } else {
    b.className = 'pc-key';
    b.innerHTML = `<span class="num">${k.n}</span>` +
                  (k.s ? `<span class="sub">${k.s}</span>` : '');
    b.addEventListener('click', () => pressDigit(k.n));
  }

  pcPad.appendChild(b);
});

/* -- dot painting -- */
function paintDots() {
  dotEls.forEach((d, i) => d.classList.toggle('filled', i < entered.length));
}

/* -- digit press -- */
function pressDigit(d) {
  if (entered.length >= CODE_LENGTH) return;

  entered += d;
  paintDots();

  if (entered.length === CODE_LENGTH) {
    // brief beat so the last dot is visible before checking
    setTimeout(checkPasscode, 180);
  }
}

/* -- verify -- */
function checkPasscode() {
  if (entered === PASSCODE) {
    pcLayer.classList.add('entered');
    pcDots.classList.add('hide');

    setTimeout(() => {
      pcLayer.classList.remove('show');

      setTimeout(() => {
        screens.lock.classList.add('unlocked');

        setTimeout(() => {
          showScreen('unlocked');
          screens.lock.classList.remove('unlocked');
        }, 700);
      }, 320);
    }, 260);

  } else {
    // wrong passcode
    pcDots.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate([12, 60, 12]);

    setTimeout(() => {
      pcDots.classList.remove('shake');
      entered = '';
      paintDots();
    }, 520);
  }
}

Please work on Part 1 only. Keep everything in the existing website and do not create a separate project.

Focus on the opening section:

1. Keep the existing closed envelope with the heart seal.

2. Keep the current envelope-opening animation because I already like it.

3. Once the envelope opens, display the love letter directly.

4. Remove the countdown completely. Do not show any days, hours, or minutes counter.

5. Make sure the envelope disappears after opening, leaving only the letter visible.

6. Keep the existing letter content.

Do not work on the next section yet. Only make the necessary changes to Part 1. Keep the existing code and design intact wherever possible.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/073ebdd9-109c-59bb-9d29-5dd64a939ab9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

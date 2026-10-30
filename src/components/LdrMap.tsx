import together from "@/assets/together.jpg";
import { BEKASI, COUNTRIES, KL, MAP_H, MAP_W } from "@/lib/mapPaths";

function Pin({ x, y, label, who, below }: { x: number; y: number; label: string; who: string; below?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="18" className="pin-pulse" />
      <path d="M0 0 C-6 -10 -16 -14 -16 -26 A16 16 0 0 1 16 -26 C16 -14 6 -10 0 0Z" fill="#e56b8f" stroke="#fff" strokeWidth="2.5" />
      <text y="-21" textAnchor="middle" fontSize="15" fill="#fff">♥</text>
      <g transform={`translate(0,${below ? 30 : -48})`}>
        <text textAnchor="middle" className="map-label">{label}</text>
        <text y="20" textAnchor="middle" className="map-who">{who}</text>
      </g>
    </g>
  );
}

export function LdrMap() {
  const mx = (BEKASI.x + KL.x) / 2 + 90, my = (BEKASI.y + KL.y) / 2 - 20;
  const d = `M${KL.x},${KL.y} Q${mx},${my} ${BEKASI.x},${BEKASI.y}`;
  return (
    <div className="map-wrap">
      <h2 className="sec-title">Miles Apart, Never Far</h2>
      <p className="sec-sub">Two countries, one heart.</p>
      <div className="map-card">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="map-svg" role="img" aria-label="Map of Indonesia and Malaysia linking Kuala Lumpur and Bekasi">
          <rect width={MAP_W} height={MAP_H} fill="#fdf1f3" />
          {Object.entries(COUNTRIES).map(([k, p]) => (
            <path key={k} d={p} className={k === "IDN" || k === "MYS" ? "land hi" : "land"} />
          ))}
          <text x="560" y="300" className="map-country">INDONESIA</text>
          <text x="140" y="120" className="map-country">MALAYSIA</text>
          <path d={d} className="map-line" />
          <text x={mx - 40} y={my + 52} textAnchor="middle" className="map-heart">♥</text>
          <text x={mx - 40} y={my + 76} textAnchor="middle" className="map-who">≈ 1,200 km</text>
          <Pin x={KL.x} y={KL.y} label="Kuala Lumpur" who="Haris" />
          <Pin x={BEKASI.x} y={BEKASI.y} label="Bekasi" who="Me" below />
        </svg>
      </div>
      <p className="map-end">Separated by distance, connected by love. Happy anniversary, Haris. ♥</p>
      <div className="wish">
        <p className="script">one day, no more miles</p>
        <p className="wish-text">I hope that one day these kilometres simply disappear — no more goodbyes at airports, no more good nights through a screen. Just you and me, in the same place, under the same sky, finally together for good.</p>
        <img src={together} alt="A cartoon girl and boy running into each other's arms" width={1024} height={768} loading="lazy" className="wish-img" />
      </div>
    </div>
  );
}

// "Our Memories" polaroid gallery. To add a photo: upload it, then set `image`
// to its URL. Add, remove or reorder entries freely — 4–6 photos look best.
import memory1 from "@/assets/memory-1.png.asset.json";
import memory2 from "@/assets/memory-2.png.asset.json";
import memory3 from "@/assets/memory-3.png.asset.json";
import memory4 from "@/assets/memory-4.png.asset.json";
import memory5 from "@/assets/memory-5.png.asset.json";

export type Memory = { caption: string; image?: string };

export const MEMORIES: Memory[] = [
  { caption: "where it all began", image: memory1.url },
  { caption: "late night rounds", image: memory2.url },
  { caption: "our little victories", image: memory3.url },
  { caption: "team us", image: memory4.url },
  { caption: "moments between us", image: memory5.url },
];

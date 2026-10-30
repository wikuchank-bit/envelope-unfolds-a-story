// "Our Memories" polaroid gallery. To add a photo: upload it, then set `image`
// to its URL. Add, remove or reorder entries freely — 4–6 photos look best.
export type Memory = { caption: string; image?: string };

export const MEMORIES: Memory[] = [
  { caption: "where it all began" },
  { caption: "late night rounds" },
  { caption: "our little victories" },
  { caption: "team us" },
  { caption: "moments between us" },
];

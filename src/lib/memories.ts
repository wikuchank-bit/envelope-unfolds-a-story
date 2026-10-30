// "Our Story" timeline. To add a photo: upload it, then set `image` to its URL.
// Add, remove or reorder entries freely — the layout adapts.
export type Memory = { title: string; caption: string; date?: string; image?: string };

export const MEMORIES: Memory[] = [
  { title: "The First Game", caption: "Where it all began — one match, and suddenly I didn't want to log off.", date: "November 2025" },
  { title: "Late Night Rounds", caption: "Losing track of time, laughing more than we were playing.", date: "December 2025" },
  { title: "Our Little Victories", caption: "Every win felt better because it was ours.", date: "January 2026" },
  { title: "Team Us", caption: "Covering each other's back, in every game and outside of it.", date: "March 2026" },
  { title: "Moments Between", caption: "The quiet calls, the long talks, the ordinary days that became special.", date: "June 2026" },
  { title: "Still Playing", caption: "Many more levels to go — together.", date: "Today" },
];

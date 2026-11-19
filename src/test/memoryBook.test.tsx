import { describe, expect, it } from "vitest";
import { BOOK_PAGES, FIREWORK_TIMES, fireworksAt } from "@/lib/memoryBook";

describe("connected scrapbook surprise", () => {
  it("keeps all nine newly uploaded photos exactly once in the book", () => {
    const photos = BOOK_PAGES.flatMap((p) => p.photos);
    expect(photos).toHaveLength(9);
    expect(new Set(photos).size).toBe(9);
    expect(photos.filter((p) => p.includes("book-memory-"))).toHaveLength(9);
  });
  it("plays exactly three separate explosions in order", () => {
    expect(FIREWORK_TIMES).toEqual([1200, 4200, 7400]);
    expect([1199, 1200, 4199, 4200, 7399, 7400].map(fireworksAt)).toEqual([0, 1, 1, 2, 2, 3]);
  });
});
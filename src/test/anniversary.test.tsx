import { describe, expect, it } from "vitest";
import { checkPasscode } from "@/components/LockScreen";
import { CHAT, elapsed, START } from "@/routes/index";
import { MEMORIES } from "@/lib/memories";

describe("anniversary rules", () => {
  it("unlocks only with 221125", () => {
    expect(checkPasscode("221125")).toBe(true);
    expect(checkPasscode("251122")).toBe(false);
  });
  it("counts from 22 Nov 2025 and keeps going past 31 Oct 2026", () => {
    expect(elapsed(START, new Date(2026, 9, 31, 0, 0, 0)).days).toBe(343);
    expect(elapsed(START, new Date(2027, 10, 22, 1, 2, 3))).toEqual({ days: 730, hours: 1, minutes: 2, seconds: 3 });
  });
  it("memories gallery stays small (4–6) with no dates or chronological titles", () => {
    expect(MEMORIES.length).toBeGreaterThanOrEqual(4);
    expect(MEMORIES.length).toBeLessThanOrEqual(6);
    expect(MEMORIES.every((m) => !("date" in m) && !("title" in m))).toBe(true);
  });
  it("conversation opens with Haris on the left, answered by me on the right", () => {
    expect(CHAT[0]).toMatchObject({ from: "haris", text: "Kamu itu type aku banget." });
    expect(CHAT.map((c) => [c.from, c.text])).toEqual([
      ["haris", "Kamu itu type aku banget."], ["me", "Masasi?"],
      ["haris", "Iya aku udah cinta banget sama kamu."], ["me", "Ehhh..."],
    ]);
  });
});

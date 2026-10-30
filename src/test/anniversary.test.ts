import { describe, expect, it } from "vitest";
import { checkPasscode } from "@/components/LockScreen";
import { elapsed, START } from "@/routes/index";

describe("anniversary rules", () => {
  it("unlocks only with 221125", () => {
    expect(checkPasscode("221125")).toBe(true);
    expect(checkPasscode("251122")).toBe(false);
  });
  it("counts from 22 Nov 2025 and keeps going past 31 Oct 2026", () => {
    expect(elapsed(START, new Date(2026, 9, 31, 0, 0, 0)).days).toBe(343);
    expect(elapsed(START, new Date(2027, 10, 22, 1, 2, 3))).toEqual({ days: 730, hours: 1, minutes: 2, seconds: 3 });
  });
});

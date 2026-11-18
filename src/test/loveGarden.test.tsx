import { describe, expect, it } from "vitest";
import { PETAL_COUNT, petalLoves, stageAfterPick } from "@/lib/loveGarden";
import { heartScreenY } from "@/lib/heartProjection";

describe("flower love story", () => {
  it("alternates uncertainty and love for each of the eight petals", () => {
    expect(Array.from({ length: PETAL_COUNT }, (_, i) => petalLoves(i + 1))).toEqual([false, true, false, true, false, true, false, true]);
  });
  it("the final petal always reveals love", () => {
    expect(PETAL_COUNT).toBe(8);
    expect(petalLoves(PETAL_COUNT)).toBe(true);
  });
  it("plants the center only after the final petal", () => {
    expect(stageAfterPick(7)).toBe("picking");
    expect(stageAfterPick(8)).toBe("planting");
  });
  it("projects the heart lobes above its pointed bottom", () => {
    expect(heartScreenY(300, 1, 100)).toBe(200);
    expect(heartScreenY(300, -1, 100)).toBe(400);
  });
});
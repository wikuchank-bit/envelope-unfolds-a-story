export const PETAL_COUNT = 8;

// Picking starts with uncertainty and always ends in love.
export function petalLoves(picked: number) {
  return picked > 0 && picked % 2 === 0;
}

export type GardenStage = "growing" | "picking" | "planting" | "tree" | "complete";

export function stageAfterPick(picked: number): GardenStage {
  return picked >= PETAL_COUNT ? "planting" : "picking";
}
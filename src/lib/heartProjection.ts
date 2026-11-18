// Mathematical heart coordinates point upward; screen coordinates point downward.
export function heartScreenY(center: number, y: number, scale: number) {
  return center - y * scale;
}
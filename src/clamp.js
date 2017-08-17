export default function clamp(min, x, max) {
  return Math.max(min, Math.min(max, x))
}

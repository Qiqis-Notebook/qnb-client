export default function scaleValue(scale: number) {
  return Math.round((1.0 / scale) * 10) / 10;
}

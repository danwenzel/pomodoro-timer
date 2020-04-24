export default function zeroPadded(value) {
  const int = Math.max(parseInt(value, 10), 0) || 0;
  return int < 10 ? `0${int}` : String(int);
}

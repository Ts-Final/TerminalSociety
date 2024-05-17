export function nextDay() {
  let days = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  days += 1
  return days * 24 * 60 * 60 * 1000;
}
export default function formatDate(s) {
  const [d, m, y] = s.split("/").map(Number);
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1];
  if (!d || !m || !y || m < 1 || m > 12) return "";
  return `${String(d).padStart(2, "0")} ${month}`;
}
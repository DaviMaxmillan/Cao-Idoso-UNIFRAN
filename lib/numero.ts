const EVENT_YEAR = process.env.EVENT_YEAR ?? "2026";

export function formatNumeroCarteirinha(numeroSequencial: number) {
  return `${EVENT_YEAR}-${String(numeroSequencial).padStart(3, "0")}`;
}

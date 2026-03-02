export function formatPrice(value: number): string {
  return Math.round(value).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

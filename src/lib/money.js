// Indian Rupee formatter — handles 1,00,000 (lakh) grouping.
const inr0 = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
});
const inr2 = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function inr(n, { decimals = false } = {}) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '₹0';
  return (decimals ? inr2 : inr0).format(num);
}

// Formats a numeric amount with its currency code, e.g. formatCurrency(45000, 'PKR') -> "PKR 45,000.00"
export const formatCurrency = (amount, currency = 'PKR') => {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'PKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback if the currency code isn't ISO-recognized
    return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

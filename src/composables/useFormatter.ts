export default () => {
  const formatCurrency = (
    value: number,
    country: string = "en-NG",
    currency: string = "NGN",
    fraction: number = 0
  ) =>
    new Intl.NumberFormat(country, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: fraction
    }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat().format(value);
  return { formatCurrency, formatNumber };
};

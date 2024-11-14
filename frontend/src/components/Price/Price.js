import React from "react";

export default function Price({ price, locale = "en-US", currency = "USD" }) {
  const formatPrice = () =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(price);

  return <span>{formatPrice()}</span>;
}

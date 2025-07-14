import type { EventPrice } from "../../types";


export const Price = ({ price, currency, displayAlternateSymbol = true }: EventPrice) => {
  if (price === 0) return null;

  const formattedPrice = Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL' }).format(price);

  return <>{formattedPrice}</>;
};

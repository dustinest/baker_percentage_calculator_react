export type RecipePortion = {
  label: string;
  amount: number;
  grams: number;
}

const roundToTen = (value: number) => Math.round(value * 10) / 10;

export const getRecipePortions = (grams: number, amount: number): RecipePortion[] => {
  if (grams === 0 || amount === 0) return [];
  if (amount <= 1) return [{
    label: `${amount}`,
    amount: 1,
    grams: roundToTen(grams)
  }];
  const digits = Math.floor(amount * 10 % 10);
  if (digits === 0) return [
    { label: `${amount}`, amount: amount, grams: roundToTen(grams) },
    { label: `1/${amount}`, amount: 1, grams: Math.floor(grams / amount * 10) / 10 }
  ];
  const rational = Math.floor(amount);

  const digitsAmount = (digits / 10) + (rational === 1 ? 0 : 1);
  const digitsGrams = Math.round(grams / amount * digitsAmount);

  const rationalAmount = Math.round(amount - digitsAmount);

  const rationalResult = { label: `${rationalAmount}`, amount: rationalAmount, grams: roundToTen(grams - digitsGrams) };
  const digitsResult = {label: `${digitsAmount}`, amount: digitsAmount, grams: digitsGrams};
  if (digitsResult.amount > rationalResult.amount) {
    return [
      { label: `${amount}`, amount: amount, grams: roundToTen(grams) },
      digitsResult,
      rationalResult
    ];
  }
  return [
    { label: `${amount}`, amount: amount, grams: roundToTen(grams) },
    rationalResult,
    digitsResult
  ];
}



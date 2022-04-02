export const normalizeNumber = (value: number): number => {
    if (value === 0) return 0;
    return Math.round(value * 100) / 100;
};

export const normalizeNumberToString = (value: number, digits: number = 2): string => {
    return value.toLocaleString(undefined, {minimumFractionDigits: digits, maximumFractionDigits: digits})
};

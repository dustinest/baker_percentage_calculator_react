export const normalizeNumber = (value: number): number => {
    if (value === 0) return 0;
    return Math.floor(value * 100) / 100;
};
export const normalizeNumberString = (value: number, digits: number = 2): string => {
    if (digits === 0) return Math.floor(value).toString();
    return value.toLocaleString(undefined, {minimumFractionDigits: digits, maximumFractionDigits: digits})
};

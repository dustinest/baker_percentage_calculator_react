export const normalizeNumber = (value: number): number => {
    if (value === 0) return 0;
    return Math.round(value * 100) / 100;
};

export const formatPortals = (value: number): string => {
  if (value >= 10 ** 9) return (`${Number((value / 10 ** 8).toFixed(1))}B`);
  if (value >= 10 ** 6) return (`${Number((value / 10 ** 5).toFixed(1))}M`);
  if (value >= 10 ** 3) return (`${Number((value / 10 ** 3).toFixed(1))}K`);
  return Math.floor(value).toString();
};

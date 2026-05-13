export const QA_START = new Date("2021-06-01");
export const AUTOMATION_START = new Date("2024-11-01");

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

export const yearsBetween = (from: Date, to: number = Date.now()) =>
  (to - from.getTime()) / YEAR_MS;

export const roundHalf = (y: number) => Math.round(y * 2) / 2;

export const totalYearsExperience = () => roundHalf(yearsBetween(QA_START));

export const halfYearSuffixed = (y: number) => `${roundHalf(y).toFixed(1)}y`;

export const formatYears = (y: number) => {
  const r = roundHalf(y);
  return Number.isInteger(r) ? `${r}` : r.toFixed(1);
};

export const formatYearsPhrase = (y: number) => {
  const num = formatYears(y);
  return `${num} year${num === "1" ? "" : "s"}`;
};

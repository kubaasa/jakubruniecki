export type FuzzyResult<T> = {
  item: T;
  score: number;
};

export function fuzzyMatch<T>(
  items: ReadonlyArray<T>,
  query: string,
  getLabel: (item: T) => string,
): FuzzyResult<T>[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.map((item) => ({ item, score: 0 }));

  const out: FuzzyResult<T>[] = [];
  for (const item of items) {
    const label = getLabel(item).toLowerCase();
    let qi = 0;
    let score = 0;
    let consecutive = 0;
    for (let li = 0; li < label.length; li++) {
      if (label[li] === q[qi]) {
        score += 1 + consecutive * 2;
        consecutive += 1;
        qi += 1;
        if (qi === q.length) break;
      } else {
        consecutive = 0;
      }
    }
    if (qi === q.length) out.push({ item, score });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

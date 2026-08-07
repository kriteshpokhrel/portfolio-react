export interface CategoryDef {
  key: string;
  label: string;
}

// Declared taxonomy — order here controls chip order. Chips only appear once
// posts in more than one of these categories exist.
export const CATEGORIES: CategoryDef[] = [
  { key: "tech", label: "Tech" },
  { key: "movies", label: "Movies" },
  { key: "coffee", label: "Coffee" },
  { key: "life", label: "Life" },
];

export const DEFAULT_CATEGORY = "tech";

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

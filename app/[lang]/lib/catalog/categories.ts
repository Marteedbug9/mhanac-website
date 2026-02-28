import type { Lang } from "../i18n";

export type Region = "us" | "haiti";

export type CategoryKey =
  | "deals"
  | "electronics"
  | "home_kitchen"
  | "beauty"
  | "fashion"
  | "grocery"
  | "health"
  | "baby_kids"
  | "toys_games"
  | "sports_outdoors"
  | "automotive"
  | "tools_home_improvement"
  | "office_school"
  | "pet_supplies"
  | "services"
  | "wholesale_bulk";

export type Category = {
  key: CategoryKey;
  regions: Region[];
  /**
   * ✅ IMPORTANT:
   * On ne stocke plus les traductions ici.
   * Le label sera lu depuis i18n.ts => t[lang].categories[key]
   */
  label?: Partial<Record<Lang, string>>;
  icon?: string;
};

export const CATEGORIES: Category[] = [
  { key: "deals", regions: ["us", "haiti"] },
  { key: "electronics", regions: ["us", "haiti"] },
  { key: "home_kitchen", regions: ["us", "haiti"] },
  { key: "beauty", regions: ["us", "haiti"] },
  { key: "fashion", regions: ["us", "haiti"] },
  { key: "grocery", regions: ["us", "haiti"] },
  { key: "health", regions: ["us", "haiti"] },
  { key: "baby_kids", regions: ["us", "haiti"] },
  { key: "toys_games", regions: ["us", "haiti"] },

  // ✅ Sport (mets ["us"] si tu veux US only)
  { key: "sports_outdoors", regions: ["us", "haiti"] },

  // ✅ US only (selon ton choix)
  { key: "automotive", regions: ["us"] },
  { key: "pet_supplies", regions: ["us"] },

  { key: "tools_home_improvement", regions: ["us", "haiti"] },
  { key: "office_school", regions: ["us", "haiti"] },

  // ✅ Haiti only (selon ton choix)
  { key: "services", regions: ["haiti"] },

  { key: "wholesale_bulk", regions: ["us", "haiti"] },
];

export function categoriesByRegion(region: Region): Category[] {
  return CATEGORIES.filter((c) => c.regions.includes(region));
}
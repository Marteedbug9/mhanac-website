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
  regions: Region[]; // ✅ link to USA / Haiti
  label: Record<Lang, string>;
  icon?: string;
};

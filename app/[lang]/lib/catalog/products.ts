import type { Lang } from "../i18n";
import type { Region, CategoryKey } from "./categories";

export type Product = {
  id: string;
  region: Region;
  category: CategoryKey;
  title: Record<Lang, string>;
  price: number;
  currency: "USD" | "HTG";
  image?: string; // /images/...
};

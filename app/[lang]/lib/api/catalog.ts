import type { Lang } from "../i18n";
import type { Region, CategoryKey } from "../catalog/categories";
import type { Product } from "../catalog/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type BackendCategory = {
  key: CategoryKey;
  label: Record<Lang, string>;
  regions: Region[];
  icon?: string;
};

export async function fetchCategoriesFromBackend(region: Region) {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}/catalog/categories?region=${region}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as BackendCategory[];
  } catch {
    return null;
  }
}

export async function fetchProductsFromBackend(args: {
  region: Region;
  category: CategoryKey;
  lang: Lang;
  q?: string;
}) {
  if (!API_URL) return null;

  const { region, category, lang, q } = args;
  const qs = new URLSearchParams({ region, category, lang });
  if (q) qs.set("q", q);

  try {
    const res = await fetch(`${API_URL}/catalog/products?${qs.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Product[];
  } catch {
    return null;
  }
}

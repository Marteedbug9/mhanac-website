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

export const MOCK_PRODUCTS: Product[] = [
  // ✅ DEALS
  {
    id: "deal_us_tv",
    region: "us",
    category: "deals",
    title: { en: "4K Smart TV Deal", fr: "Offre TV 4K", ht: "Deal TV 4K", es: "Oferta TV 4K" },
    price: 199,
    currency: "USD",
    image: "/images/listproduc/electro.png",
  },
  {
    id: "deal_ht_rice",
    region: "haiti",
    category: "deals",
    title: { en: "Rice + Oil Pack", fr: "Pack riz + huile", ht: "Pake diri + lwil", es: "Paquete arroz + aceite" },
    price: 950,
    currency: "HTG",
    image: "/images/listproduc/groce1.png",
  },

  // ✅ ELECTRONICS
  {
    id: "p_iphone13_us",
    region: "us",
    category: "electronics",
    title: { en: "iPhone 13 (Refurbished)", fr: "iPhone 13 (Reconditionné)", ht: "iPhone 13 (Renove)", es: "iPhone 13 (Reacondicionado)" },
    price: 329,
    currency: "USD",
    image: "/images/listproduc/electro.png",
  },

  // ✅ HOME
  {
    id: "p_bed_us",
    region: "us",
    category: "home_kitchen",
    title: { en: "Home Essentials - Bedding Set", fr: "Essentiels maison - literie", ht: "Kay - kabann", es: "Hogar - ropa de cama" },
    price: 49,
    currency: "USD",
    image: "/images/listproduc/home.png",
  },

  // ✅ BEAUTY
  {
    id: "p_beauty_ht",
    region: "haiti",
    category: "beauty",
    title: { en: "Makeup Kit", fr: "Kit maquillage", ht: "Kit makiyaj", es: "Kit de maquillaje" },
    price: 1250,
    currency: "HTG",
    image: "/images/listproduc/beauty.png",
  },

  // ✅ FASHION
  {
    id: "p_shoes_us",
    region: "us",
    category: "fashion",
    title: { en: "Running Shoes", fr: "Chaussures de sport", ht: "Soulye kouri", es: "Zapatillas" },
    price: 39,
    currency: "USD",
    image: "/images/listproduc/fashion.png",
  },
];

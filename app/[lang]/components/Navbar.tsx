"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegionToggle from "./RegionToggle";

type Props = {
  lang: "en" | "fr" | "ht" | "es";
};

export default function Navbar({ lang }: Props) {
  const router = useRouter();
  const [cartCount] = useState(2); // 🔔 demo

  return (
    <header className="bg-[#0b4fb3] text-white sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= TOP ROW ================= */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-[160px]">
            <Image
              src="/images/mhanac%20logo1.png"
              alt="MHANAC"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-black text-lg tracking-wide">MHANAC</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="flex bg-white rounded overflow-hidden">
              <input
                placeholder={
                  lang === "ht"
                    ? "Chèche pwodwi..."
                    : lang === "fr"
                    ? "Rechercher..."
                    : "Search products..."
                }
                className="flex-1 px-4 py-2 text-sm text-black outline-none"
              />
              <button className="px-4 bg-black text-white text-sm font-semibold">
                Search
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button className="relative hover:text-green-300 transition">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold w-5 h-5 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login */}
            <button
              onClick={() => router.push(`/${lang}/login`)}
              className="hover:text-green-300 transition font-semibold text-sm"
            >
              Login
            </button>

            {/* Region flags */}
            <RegionToggle />
          </div>
        </div>

        {/* ================= CATEGORY BAR ================= */}
        <nav className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
          {[
            "Deals",
            "Electronics",
            "Home",
            "Beauty",
            "Fashion",
            "Grocery",
            "Wholesale",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/${lang}/products`}
              className="
                relative px-3 py-2 text-sm font-semibold
                transition transform
                hover:scale-110
                hover:text-green-300
                after:absolute after:left-0 after:-bottom-1
                after:w-0 after:h-[2px] after:bg-green-300
                hover:after:w-full after:transition-all
              "
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

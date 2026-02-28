"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Region = "us" | "haiti";
const STORAGE_KEY = "MHANAC_REGION";
const LANG_KEY = "MHANAC_LANG";

/**
 * ✅ Responsive flags height:
 * - xs: 140
 * - sm: 180
 * - md: 210
 * - lg: 230
 */
const FLAG_BOX_H = "h-[140px] sm:h-[180px] md:h-[210px] lg:h-[230px]";
const FLAG_PADDING = "p-4 sm:p-6";

type FloatItem = {
  img: string;
  alt: string;
  className: string; // responsive position + size
  priority?: boolean;
};

const floatItems: FloatItem[] = [
  {
    img: "/images/listproduc/electro.png",
    alt: "electronics",
    className:
      "hidden sm:block " +
      "w-[clamp(160px,18vw,280px)] h-[clamp(160px,18vw,280px)] " +
      "left-[-6%] sm:left-[-4%] lg:left-[-3%] bottom-[-26%] sm:bottom-[-24%] lg:bottom-[-28%] " +
      "opacity-30 blur-[0.7px]",
  },
  {
    img: "/images/listproduc/beauty.png",
    alt: "beauty",
    className:
      "hidden md:block " +
      "w-[clamp(170px,20vw,320px)] h-[clamp(170px,20vw,320px)] " +
      "left-[18%] md:left-[16%] lg:left-[15%] top-[68%] md:top-[72%] lg:top-[64%] " +
      "opacity-28 blur-[0.9px]",
  },
  {
    img: "/images/listproduc/fashion.png",
    alt: "fashion",
    className:
      "hidden sm:block " +
      "w-[clamp(150px,18vw,300px)] h-[clamp(150px,18vw,300px)] " +
      "right-[25%] sm:right-[21%] lg:right-[21%] top-[65%] sm:top-[62%] md:top-[64%] " +
      "opacity-28 blur-[0.9px]",
  },
  {
    img: "/images/listproduc/home.png",
    alt: "home",
    className:
      "hidden lg:block " +
      "w-[clamp(220px,26vw,420px)] h-[clamp(220px,26vw,420px)] " +
      "right-[-6%] xl:right-[-4%] 2xl:right-[-2%] bottom-[8%] xl:bottom-[6%] " +
      "opacity-22 blur-[1px]",
  },
  {
    img: "/images/listproduc/groce1.png",
    alt: "grocery",
    className:
      "hidden md:block " +
      "w-[clamp(160px,18vw,300px)] h-[clamp(160px,18vw,300px)] " +
      "left-[32%] md:left-[39%] lg:left-[43%] top-[5%] md:top-[2%] lg:top-[4%] " +
      "opacity-22 blur-[1px]",
  },
  {
    img: "/images/mhanac logo1.png",
    alt: "mhanac logo",
    className:
      "block " +
      "w-[clamp(90px,12vw,210px)] h-[clamp(90px,12vw,210px)] " +
      "left-[8%] sm:left-[4%] top-[-10%] sm:top-[-10%] md:top-[-14%] " +
      "opacity-25 blur-[0.8px]",
    priority: true,
  },
];

export default function RegionGate() {
  const router = useRouter();

  const phrases = useMemo(
    () => [
      { text: "What is your region?" },
      { text: "Quelle est votre région ?" },
      { text: "Ki rejyon ou ye ?" },
      { text: "¿Cuál es tu región?" },
    ],
    []
  );

  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<Region | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setI((p) => (p + 1) % phrases.length), 1800);
    return () => clearInterval(timer);
  }, [phrases.length]);

  // ✅ OPTIONAL AUTO-REDIRECT:
  // If user already chose before, send them directly to the correct language page.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRegion = (localStorage.getItem(STORAGE_KEY) as Region | null) ?? null;
    const savedLang = localStorage.getItem(LANG_KEY);

    if (
      savedRegion &&
      (savedRegion === "us" || savedRegion === "haiti") &&
      (savedLang === "en" || savedLang === "ht")
    ) {
      router.replace(`/${savedLang}/products?region=${savedRegion}&category=deals`);
    }
  }, [router]);

  function choose(region: Region) {
    setSelected(region);

    const lang = region === "us" ? "en" : "ht";

    // ✅ Save region + lang
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, region);
      localStorage.setItem(LANG_KEY, lang);
    }

    // ✅ Go to translated route directly
    router.push(`/${lang}/products?region=${region}&category=deals`);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/front.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Big background text */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 grid place-items-center opacity-[0.10] pointer-events-none select-none text-center px-6"
      >
        <div className="text-[clamp(26px,4vw,64px)] font-black tracking-wide leading-tight">
          {phrases[i].text}
        </div>
      </div>

      {/* ✅ Float layer BEHIND the card so it never blocks content */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* soft vignette keeps center readable on all screens */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.22)_58%,rgba(0,0,0,0.45)_100%)]" />

        {floatItems.map((c, idx) => (
          <div
            key={idx}
            className={["absolute z-0 grid place-items-center rounded-2xl", c.className].join(" ")}
          >
            <Image
              src={c.img}
              alt={c.alt}
              width={650}
              height={650}
              priority={c.priority}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-5xl z-20">
        {/* Card */}
        <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="font-black tracking-wide">MHANAC</div>
          </div>

          <h1 className="mt-4 text-[clamp(22px,3.2vw,52px)] font-semibold leading-tight">
            {phrases[i].text}
          </h1>

          <p className="mt-2 text-white/85 text-sm sm:text-base">
            {selected === "haiti" ? "Chwazi peyi ou pou kontinye." : "Select your country to continue."}
          </p>

          {/* Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-7">
            <button
              type="button"
              onClick={() => choose("us")}
              aria-label="Choose USA"
              className={["relative group transition rounded-2xl overflow-hidden", FLAG_BOX_H].join(" ")}
            >
              <Image
                src="/images/usa.png"
                alt="USA"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.06]",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>

            <button
              type="button"
              onClick={() => choose("haiti")}
              aria-label="Choose Haiti"
              className={["relative group transition rounded-2xl overflow-hidden", FLAG_BOX_H].join(" ")}
            >
              <Image
                src="/images/haiti.png"
                alt="Haiti"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.06]",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
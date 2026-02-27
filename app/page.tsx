"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Region = "us" | "haiti";
const STORAGE_KEY = "MHANAC_REGION";

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
      // hidden on very small screens, appears from sm+
      "hidden sm:block " +
      // size using clamp (works across screens)
      "w-[clamp(160px,18vw,280px)] h-[clamp(160px,18vw,280px)] " +
      // position: bottom-left zone, safe distances
      "left-[-6%] sm:left-[-4%] lg:left-[-3%] bottom-[-38%] sm:bottom-[-20%] lg:bottom-[-24%] " +
      "opacity-90",
  },
  {
    img: "/images/listproduc/beauty.png",
    alt: "beauty",
    className:
      "hidden md:block " +
      "w-[clamp(170px,20vw,320px)] h-[clamp(170px,20vw,320px)] " +
      "left-[8%] md:left-[6%] lg:left-[5%] top-[8%] md:top-[12%] lg:top-[16%] " +
      "opacity-85",
  },
  {
    img: "/images/listproduc/fashion.png",
    alt: "fashion",
    className:
      "hidden sm:block " +
      "w-[clamp(150px,18vw,300px)] h-[clamp(150px,18vw,300px)] " +
      "right-[25%] sm:right-[34%] lg:right-[-43%] top-[40%] sm:top-[42%] md:top-[44%] " +
      "opacity-90",
  },
  {
    img: "/images/listproduc/home.png",
    alt: "home",
    className:
      "hidden lg:block " +
      "w-[clamp(220px,26vw,420px)] h-[clamp(220px,26vw,420px)] " +
      "right-[-6%] xl:right-[-4%] 2xl:right-[-2%] bottom-[18%] xl:bottom-[-16%] " +
      "opacity-75",
  },
  {
    img: "/images/listproduc/groce1.png",
    alt: "grocery",
    className:
      "hidden md:block " +
      "w-[clamp(160px,18vw,300px)] h-[clamp(160px,18vw,300px)] " +
      "left-[40%] md:left-[44%] lg:left-[46%] top-[50%] md:top-[52%] lg:top-[-24%] " +
      "opacity-80",
  },
  {
    img: "/images/mhanac logo1.png",
    alt: "mhanac logo",
    className:
      // show small on mobile, larger on desktop
      "block " +
      "w-[clamp(90px,12vw,210px)] h-[clamp(90px,12vw,210px)] " +
      "left-[0%] sm:left-[2%] top-[-10%] sm:top-[-10%] md:top-[-14%] " +
      "opacity-90",
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

  function choose(region: Region) {
    setSelected(region);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, region);
    }

    const lang = region === "us" ? "en" : "ht";
    router.push(`/${lang}/products?region=${region}&category=deals`);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
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
        className="fixed inset-0 -z-10 grid place-items-center opacity-[0.10] pointer-events-none select-none text-center px-6"
      >
        <div className="text-[clamp(26px,4vw,64px)] font-black tracking-wide leading-tight">
          {phrases[i].text}
        </div>
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Floating images (responsive, safe) */}
        <div className="pointer-events-none absolute inset-0">
          {floatItems.map((c, idx) => (
            <div
              key={idx}
              className={[
                "absolute z-20 grid place-items-center rounded-2xl",
                c.className,
              ].join(" ")}
            >
              <Image
                src={c.img}
                alt={c.alt}
                width={600}
                height={600}
                priority={c.priority}
                className="object-contain drop-shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
              />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="relative z-10 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
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
                className={["object-contain", FLAG_PADDING, "transition-transform duration-300 group-hover:scale-[1.06]"].join(" ")}
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
                className={["object-contain", FLAG_PADDING, "transition-transform duration-300 group-hover:scale-[1.06]"].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";


type Region = "us" | "haiti";

/* =========================================================
   ✅ 1) FLAGS SETTINGS (USA + HAITI)
   - Change FLAG_BOX_H to change the button height
   - Change FLAG_PADDING to increase/decrease empty space inside
   ========================================================= */
const FLAG_BOX_H = "h-[160px] sm:h-[190px] md:h-[220px]";
const FLAG_PADDING = "p-4 sm:p-6";

/* =========================================================
   ✅ 2) CATEGORY ICONS (floating around the card)
   ✅ YOU EDIT HERE:
   - size: change icon size per screen
   - pos : move icon per screen (use negative values to go outside card)
   ========================================================= */

/**
 * ✅ How to move an icon:
 * - Use: left-[...], right-[...], top-[...], bottom-[...]
 * - Example: move more left => left-[-120px]
 * - Example: move up => top-[-60px]
 *
 * ✅ How to resize an icon:
 * - Use: w-[..] h-[..] + sm: + md:
 * - Example: w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px]
 *
 * ✅ Responsive:
 * - base = mobile
 * - sm:  = small screens
 * - md:  = desktop
 */
const categories = [
  {
    img: "/images/listproduc/electro.png",
    // ✅ SIZE: change these values (mobile / sm / md)

    size: "w-[352px] h-[352px] sm:w-[268px] sm:h-[268px] md:w-[290px] md:h-[290px]",
    pos: "left-[-48%] bottom-[-16px] sm:bottom-[-30px] md:bottom-[-205px]",
    
  },
  {
    img: "/images/listproduc/beauty.png",
    size: "w-[472px] h-[472px] sm:w-[388px] sm:h-[388px] md:w-[410px] md:h-[410px]",
     pos: "top-[-10px] sm:top-[-28px] md:top-[285px] right-[84%]",
  },
  {
    img: "/images/listproduc/fashion.png",
    size: "w-[472px] h-[472px] sm:w-[288px] sm:h-[288px] md:w-[310px] md:h-[310px]",
    pos: "right-[-5px] sm:right-[-5px] md:right-[122px] top-[55px] md:top-[370px]",
  },
  {
    img: "/images/listproduc/home.png",
    size: "w-[572px] h-[572px] sm:w-[488px] sm:h-[488px] md:w-[410px] md:h-[410px]",
    pos: "right-[-20px] sm:right-[-25px] md:right-[-380px] bottom-[-205px] md:bottom-[-200px]",
  },
  
  {
    img: "/images/listproduc/groce1.png",
    size: "w-[352px] h-[352px] sm:w-[288px] sm:h-[288px] md:w-[330px] md:h-[330px]",
    pos: "top-[-10px] sm:top-[-28px] md:top-[325px] right-[44%]",
  },
  {
    img: "/images/mhanac logo1.png",
  size: "w-[372px] h-[372px] sm:w-[188px] sm:h-[188px] md:w-[270px] md:h-[270px]",
    // ✅ POSITION: move it (use negative values to go outside card)
    pos: "left-[-15px] sm:left-[-35px] md:left-[-30px] top-[55px] md:top-[-200px]",
  },
] as const;

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
  const [cat, setCat] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % phrases.length), 1800);
    return () => clearInterval(t);
  }, [phrases.length]);

  function choose(region: Region) {
    setSelected(region);
  

    const defaultLang = region === "us" ? "en" : "ht";
    router.push(`/${defaultLang}/products`);
  }



  const flagBorderClass = (r: Region) =>
    selected === r
      ? ""
      : "";

  const catRingClass = (active: boolean) =>
    active ? "" : "hover:ring-blue-300";

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-white">
      {/* ✅ Background */}
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

      {/* Background big text */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 grid place-items-center opacity-[0.10] pointer-events-none select-none text-center px-6"
      >
        <div className="text-[34px] sm:text-[42px] md:text-[64px] font-black tracking-wide leading-tight">
          {phrases[i].text}
        </div>
      </div>

      {/* ✅ Wrapper relative: floating images will position around this */}
      <div className="relative w-full max-w-5xl">
        {/* ✅ FLOATING CATEGORY IMAGES (NOT CLICKABLE) */}
        <div className="pointer-events-none">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className={[
                "absolute z-20",
                c.pos,  // ✅ move here
                c.size, // ✅ resize here
                "grid place-items-center",
                "rounded-2xl",
               
                
              ].join(" ")}
            >
              <Image
                src={c.img}
                alt="category"
                width={580}
                height={580}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* ✅ Foreground card */}
        <div className="relative z-10 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex justify-between gap-3 flex-wrap">
            <div className="font-black tracking-wide">MHANAC</div>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight">
            {phrases[i].text}
          </h1>

          <p className="mt-2 text-white/85 text-sm sm:text-base">
            Select your country to continue.
          </p>

          {/* ✅ Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
            {/* USA */}
            <button
              type="button"
              onClick={() => choose("us")}
              aria-label="Choose USA"
              className={[
                "relative group ",
                flagBorderClass("us"),
                "[0_12px_35px_rgba(2,6,23,0.20)]",
                "transition",
                FLAG_BOX_H,
              ].join(" ")}
            >
              <Image
                src="/images/usa.png"
                alt="USA"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.08] ",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>

            {/* HAITI */}
            <button
              type="button"
              onClick={() => choose("haiti")}
              aria-label="Choose Haiti"
              className={[
                "relative group ",
                flagBorderClass("haiti"),
                "[0_12px_35px_rgba(2,6,23,0.20)]",
                "transition",
                FLAG_BOX_H,
              ].join(" ")}
            >
              <Image
                src="/images/haiti.png"
                alt="Haiti"
                fill
                priority
                className={[
                  "object-contain",
                  FLAG_PADDING,
                  "transition-transform duration-300 group-hover:scale-[1.08]",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          </div>

          <p className="mt-6 text-xs text-white/80">
           
          </p>
        </div>
      </div>
    </main>
  );
}

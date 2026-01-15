"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Region = "us" | "haiti";
type Lang = "en" | "fr" | "ht" | "es";

const STORAGE_KEY = "MHANAC_REGION";

function isRegion(x: any): x is Region {
  return x === "us" || x === "haiti";
}

function forceLangByRegion(region: Region): Lang {
  return region === "us" ? "en" : "ht";
}

function replaceLangInPath(pathname: string, nextLang: Lang) {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0] as string | undefined;

  const isFirstLang = first === "en" || first === "fr" || first === "ht" || first === "es";

  if (isFirstLang) {
    parts[0] = nextLang;
    return "/" + parts.join("/");
  }

  return "/" + [nextLang, ...parts].join("/");
}

export default function RegionToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const regionFromUrl = (sp.get("region") as Region | null) ?? null;
  const [region, setRegion] = useState<Region>("us");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? ((localStorage.getItem(STORAGE_KEY) as Region | null) ?? null)
        : null;

    const initial = (isRegion(regionFromUrl) && regionFromUrl) || (isRegion(saved) && saved) || "us";
    setRegion(initial);

    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, initial);
  }, [regionFromUrl]);

  const go = (r: Region) => {
    setRegion(r);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, r);

    const nextLang = forceLangByRegion(r);

    const params = new URLSearchParams(sp.toString());
    params.set("region", r);

    const nextPath = replaceLangInPath(pathname, nextLang);
    router.push(`${nextPath}?${params.toString()}`);
  };

  const active = useMemo(() => region, [region]);

  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => go("us")}
        className={[
          "rounded-xl p-1.5 border transition",
          active === "us"
            ? "border-green-400 bg-white/90"
            : "border-white/20 bg-white/10 hover:bg-white/15",
        ].join(" ")}
        aria-label="USA"
        title="USA"
      >
        <Image src="/images/usa.png" alt="USA" width={32} height={20} className="rounded-md" />
      </button>

      <button
        type="button"
        onClick={() => go("haiti")}
        className={[
          "rounded-xl p-1.5 border transition",
          active === "haiti"
            ? "border-green-400 bg-white/90"
            : "border-white/20 bg-white/10 hover:bg-white/15",
        ].join(" ")}
        aria-label="Haiti"
        title="Haiti"
      >
        <Image src="/images/haiti.png" alt="Haiti" width={32} height={20} className="rounded-md" />
      </button>
    </div>
  );
}

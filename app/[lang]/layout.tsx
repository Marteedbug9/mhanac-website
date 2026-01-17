import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import type { Lang } from "./lib/i18n";
import Footer from "./components/Footer";

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Lang };
}) {
  return (
    <>
      <Navbar lang={params.lang} />

      {children}

      <Footer lang={params.lang} />
    </>
  );
}

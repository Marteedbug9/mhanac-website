import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import type { Lang } from "./lib/i18n";
import Footer from "./components/Footer";

// 1. On définit l'interface pour correspondre aux attentes de Next.js
// Les params sont une Promise
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: Lang }>;
}

// 2. On rend la fonction 'async'
export default async function LangLayout({
  children,
  params,
}: LayoutProps) {
  
  // 3. On "await" les params avant de les utiliser
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang} />
      {children}
      <Footer lang={lang} />
    </>
  );
}
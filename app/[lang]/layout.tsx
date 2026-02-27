import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import type { Lang } from "./lib/i18n";
import Footer from "./components/Footer";

// On définit les params tels que Next.js les envoie (string)
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>; 
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps) {
  
  // On récupère le paramètre
  const { lang } = await params;

  // On force le type vers votre union 'Lang' ("en" | "fr" | etc.)
  // car vous avez probablement un middleware qui filtre déjà les langues valides.
  const currentLang = lang as Lang;

  return (
    <>
      <Navbar lang={currentLang} />
      {children}
      <Footer lang={currentLang} />
    </>
  );
}
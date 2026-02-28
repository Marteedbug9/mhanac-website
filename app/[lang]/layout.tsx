import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Lang } from "./lib/i18n";
import { CartProvider } from "@/app/providers/CartProvider";

// ✅ Next.js envoie params (string). Chez toi: Promise<{ lang: string }>
interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const currentLang = lang as Lang;

  return (
    <CartProvider>
      <Navbar lang={currentLang} />
      {children}
      <Footer lang={currentLang} />
    </CartProvider>
  );
}
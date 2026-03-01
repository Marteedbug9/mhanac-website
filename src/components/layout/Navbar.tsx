import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from '@tanstack/react-router';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Store, 
  Globe, 
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, login, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const region = localStorage.getItem('selected_region') || 'us';

  const languages = [
    { code: 'en', label: 'English', flag: 'us' },
    { code: 'ht', label: 'Kreyòl', flag: 'ht' },
    { code: 'fr', label: 'Français', flag: 'fr' },
    { code: 'es', label: 'Español', flag: 'es' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const toggleRegion = () => {
    const newRegion = region === 'us' ? 'haiti' : 'us';
    localStorage.setItem('selected_region', newRegion);
    window.location.reload(); // Reload to refresh all region-specific queries
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Region */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/mhanac logo1.png" 
                  alt="MHANAC" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=M&background=004B91&color=fff";
                  }}
                />
              </div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">MHANAC</span>
            </Link>
            
            <button 
              onClick={toggleRegion}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-bold border border-white/10"
            >
              <img 
                src={`https://flagcdn.com/${region === 'us' ? 'us' : 'ht'}.svg`} 
                alt="Region Flag" 
                className="w-5 h-3.5 object-cover rounded-sm"
              />
              <span className="uppercase">{region}</span>
              <MapPin className="w-3 h-3 opacity-50" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full h-10 px-4 pr-10 rounded-full bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 px-3">
                  <Globe className="w-5 h-5" />
                  <span className="uppercase">{i18n.language}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="gap-2"
                  >
                    <img src={`https://flagcdn.com/${lang.flag}.svg`} alt="" className="w-4 h-3" />
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Seller Link */}
            <Link to="/seller" className="text-sm font-medium hover:text-accent-foreground transition-colors">
              {t('seller_page')}
            </Link>

            {/* Auth & Cart */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground uppercase py-2 px-3">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/orders' })}>My Orders</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/seller' })}>Seller Portal</DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive">Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => login()} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 gap-2"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('login')}</span>
                </Button>
              )}

              <Link to="/cart" className="relative p-2 text-white hover:bg-white/10 rounded-full">
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary-foreground text-foreground animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="relative mt-2">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full h-10 px-4 pr-10 rounded-lg border border-border bg-background focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${i18n.language === lang.code ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <img src={`https://flagcdn.com/${lang.flag}.svg`} alt="" className="w-4 h-3" />
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Link to="/seller" className="block p-2 font-medium hover:bg-muted rounded-lg">{t('seller_page')}</Link>
              <Link to="/cart" className="block p-2 font-medium hover:bg-muted rounded-lg">{t('cart')} ({items.length})</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="block p-2 font-medium hover:bg-muted rounded-lg">My Orders</Link>
                  <button onClick={logout} className="block w-full text-left p-2 font-medium text-destructive hover:bg-destructive/5 rounded-lg">Sign Out</button>
                </>
              ) : (
                <button onClick={() => login()} className="block w-full text-left p-2 font-medium hover:bg-muted rounded-lg">{t('login')} / {t('signup')}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { 
  ShoppingBag, 
  Flame, 
  TrendingUp, 
  Grid, 
  ChevronRight,
  ChevronLeft,
  Heart,
  Snowflake,
  Sun,
  Leaf,
  Flower2,
  Play,
  Zap,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Laptop
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { blink } from '@/lib/blink';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string;
  is_best_seller: boolean;
  is_on_sale: boolean;
  season?: string;
}

const CATEGORIES = [
  { key: "deals", icon: <Flame className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "electronics", icon: <TrendingUp className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "home_kitchen", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "beauty", icon: <Heart className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "fashion", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "grocery", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "health", icon: <Heart className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "baby_kids", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "toys_games", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "sports_outdoors", icon: <TrendingUp className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "automotive", icon: <TrendingUp className="w-5 h-5" />, regions: ["us"] },
  { key: "pet_supplies", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us"] },
  { key: "tools_home_improvement", icon: <TrendingUp className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "office_school", icon: <ShoppingBag className="w-5 h-5" />, regions: ["us", "haiti"] },
  { key: "services", icon: <Grid className="w-5 h-5" />, regions: ["haiti"] },
  { key: "wholesale_bulk", icon: <Grid className="w-5 h-5" />, regions: ["us", "haiti"] },
];

const SEASONS = [
  { key: 'spring', icon: <Flower2 className="w-6 h-6 text-pink-500" />, color: 'bg-pink-50' },
  { key: 'summer', icon: <Sun className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-50' },
  { key: 'autumn', icon: <Leaf className="w-6 h-6 text-orange-500" />, color: 'bg-orange-50' },
  { key: 'winter', icon: <Snowflake className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50' },
  { key: 'valentine', icon: <Heart className="w-6 h-6 text-red-500" />, color: 'bg-red-50' },
  { key: 'christmas', icon: <Snowflake className="w-6 h-6 text-green-500" />, color: 'bg-green-50' },
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const region = localStorage.getItem('selected_region') || 'us';
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [sales, setSales] = useState<Product[]>([]);
  const [promoted, setPromoted] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [seasonalProducts, setSeasonalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bestSellersRes, salesRes, promotedRes, newArrivalsRes, seasonalRes] = await Promise.all([
          blink.db.products.list({ 
            where: { isBestSeller: "1", region }, 
            limit: 8 
          }),
          blink.db.products.list({ 
            where: { isOnSale: "1", region }, 
            limit: 8 
          }),
          blink.db.products.list({ 
            where: { isPromoted: "1", region }, 
            limit: 10 
          }),
          blink.db.products.list({ 
            where: { isNew: "1", region }, 
            limit: 8 
          }),
          blink.db.products.list({ 
            where: { season: { IS_NOT_NULL: true }, region }, 
            limit: 8 
          })
        ]);
        setBestSellers(bestSellersRes);
        setSales(salesRes);
        setPromoted(promotedRes);
        setNewArrivals(newArrivalsRes);
        setSeasonalProducts(seasonalRes);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region]);

  const filteredCategories = CATEGORIES.filter(cat => cat.regions.includes(region));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero / Ad Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Banner */}
          <div className="lg:col-span-8 h-[400px] relative rounded-3xl overflow-hidden shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
              alt="Main Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center p-12 text-white">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold mb-4 drop-shadow-lg"
              >
                Diaspora Special Deals
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl mb-8 max-w-md opacity-90 font-medium"
              >
                Connect with your roots. Shop best products from your region with exclusive discounts.
              </motion.p>
              <Button size="lg" className="w-fit rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-xl transition-all active:scale-[0.98]" onClick={() => navigate({ to: '/products' })}>
                Explore Shop
              </Button>
            </div>
          </div>

          {/* Side Ads Grid */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => navigate({ to: '/products', search: { category: 'electronics' } })}>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" 
                alt="Ad 1" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold drop-shadow-md">New Electronics</h3>
                <p className="text-sm opacity-90 font-medium">Up to 40% OFF</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer" onClick={() => navigate({ to: '/products', search: { category: 'fashion' } })}>
              <img 
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop" 
                alt="Ad 2" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold drop-shadow-md">Fashion Trends</h3>
                <p className="text-sm opacity-90 font-medium">Shop your style</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Promotions Horizontal Scroll */}
      <section className="bg-muted py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sun className="w-6 h-6 text-primary" />
              {t('seasonal_promos')}
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {SEASONS.map((season) => (
              <motion.button
                key={season.key}
                whileHover={{ y: -5 }}
                className={`flex-shrink-0 w-48 h-56 ${season.color} rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6 transition-all hover:shadow-md`}
                onClick={() => navigate({ to: '/products', search: { season: season.key } })}
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-3xl">
                  {season.icon}
                </div>
                <h3 className="text-lg font-bold capitalize text-foreground/80">{t(season.key)}</h3>
                <p className="text-xs text-muted-foreground mt-2">Explore {t(season.key)} Collection</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t('categories')}</h2>
          <Button variant="ghost" className="text-primary hover:bg-primary/5">
            View All <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {filteredCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate({ to: '/products', search: { category: cat.key } })}
              className="flex flex-col items-center p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-3">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-center line-clamp-2">{t(cat.key)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Promoted Products Carousel */}
      {promoted.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-primary shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Featured Deals</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {promoted.map((product) => (
              <div key={product.id} className="min-w-[280px]">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals & Video Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Vertical Video Promo */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Play className="w-5 h-5 text-accent" />
                Live Demo
              </h2>
              <div className="aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden relative shadow-2xl border-8 border-primary/10 group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1556740734-7f1a0297ba16?q=80&w=1974&auto=format&fit=crop" 
                  alt="Video Promo" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 border border-white/20">
                    Trending now
                  </div>
                  <h3 className="text-2xl font-black leading-tight mb-2 uppercase">Unbox the New iPhone 15</h3>
                  <p className="text-xs opacity-70 mb-6 font-medium">Watch real reviews from the community</p>
                  <Button className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-bold gap-2">
                    <Play className="w-4 h-4 fill-current" /> Watch Video
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* New Arrivals Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">New Arrivals</h2>
              </div>
              <Button variant="ghost" className="text-primary font-bold">
                See Market Latest <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.length > 0 ? newArrivals.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              )) : (
                <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-3xl border-2 border-dashed border-border/50 font-medium">
                  Latest releases from Apple, Samsung and more coming soon...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Giants / New on Market Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-muted/20 rounded-[3rem] p-12 border border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter">THE TECH HUB</h2>
              <p className="text-muted-foreground font-medium">Latest from Apple, Samsung, and Microsoft</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border font-bold text-xs uppercase tracking-widest text-primary">
                <Smartphone className="w-4 h-4" /> Mobile
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border font-bold text-xs uppercase tracking-widest text-primary">
                <Laptop className="w-4 h-4" /> Computing
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Leaf className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">This Season's Picks</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {seasonalProducts.length > 0 ? seasonalProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          )) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border-2 border-dashed border-border">
              Seasonal collections are arriving...
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t('best_sellers')}</h2>
          <Button variant="ghost" className="text-primary">
            See More <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.length > 0 ? bestSellers.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          )) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border-2 border-dashed border-border">
              Coming soon to Best Sellers...
            </div>
          )}
        </div>
      </section>

      {/* On Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            {t('on_sale')}
          </h2>
          <Button variant="ghost" className="text-primary">
            See More <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sales.length > 0 ? sales.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          )) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border-2 border-dashed border-border">
              Amazing deals coming soon...
            </div>
          )}
        </div>
      </section>

      {/* Auto-scrolling Promotion Slider before Footer */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary h-64 shadow-2xl">
            <motion.div 
              animate={{ x: ["0%", "-100%"] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex h-full"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-full h-full flex items-center justify-center p-12 text-white text-center gap-12">
                  <div className="hidden md:block w-48 h-48 bg-white/10 rounded-full blur-3xl absolute top-0 left-0" />
                  <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase">MHANAC MEGA PROMO</h2>
                    <p className="text-xl font-medium opacity-80">Ship directly from USA to Haiti with 0 extra fees</p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Button size="lg" className="rounded-full bg-yellow-400 text-primary font-bold hover:bg-yellow-500">
                        Claim Discount
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10 font-bold">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-primary rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 space-y-4 max-w-lg">
            <h2 className="text-4xl font-bold">Join the Diaspora Community</h2>
            <p className="text-primary-foreground/80 font-medium">Get early access to exclusive deals, seasonal launches, and local products delivered to your door.</p>
          </div>
          
          <div className="relative z-10 w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 h-14 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
            />
            <Button size="lg" className="h-14 rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-xl">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

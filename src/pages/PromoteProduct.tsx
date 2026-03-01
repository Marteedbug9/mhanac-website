import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { 
  Megaphone, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  TrendingUp,
  CreditCard,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { blink } from '@/lib/blink';
import { toast } from 'react-hot-toast';

const PROMOTION_PLANS = [
  { id: 'starter', name: 'Starter Boost', price: 9.99, duration: '7 days', icon: <TrendingUp className="w-6 h-6 text-blue-500" />, features: ['Grid highlight', 'Search priority'] },
  { id: 'pro', name: 'Elite Feature', price: 24.99, duration: '15 days', icon: <Sparkles className="w-6 h-6 text-yellow-500" />, features: ['Homepage carousel', 'Banner ad', 'Search priority'] },
  { id: 'viral', name: 'Viral Video', price: 49.99, duration: '30 days', icon: <Zap className="w-6 h-6 text-accent" />, features: ['Short video ad', 'Homepage carousel', 'Social media share'] },
];

export default function PromoteProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      try {
        const res = await blink.db.products.list({ where: { userId: user.id } });
        setProducts(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handlePromote = async () => {
    if (!selectedProduct || !selectedPlan) {
      toast.error('Please select a product and a plan');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      // Here we simulate the promotion being added
      await blink.db.products.update(selectedProduct, { isPromoted: "1" });
      
      const plan = PROMOTION_PLANS.find(p => p.id === selectedPlan);
      await blink.db.productPromotions.create({
        id: crypto.randomUUID(),
        productId: selectedProduct,
        sellerId: user?.id || '',
        promotionType: selectedPlan,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days demo
        status: 'active'
      });

      toast.success('Promotion activated! Your product is now being featured.');
      navigate({ to: '/seller' });
    } catch (error) {
      toast.error('Failed to activate promotion');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/seller' })} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-black italic tracking-tighter">Promote Your Products</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Select Product */}
            <Card className="rounded-3xl border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                  Select Product to Promote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                        selectedProduct === p.id ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:border-primary/50 bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={JSON.parse(p.images || '[]')[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">${p.price}</p>
                      </div>
                      {selectedProduct === p.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Select Plan */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 px-4">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                Choose Promotion Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROMOTION_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col h-full ${
                      selectedPlan === plan.id ? 'border-accent bg-accent/5 ring-4 ring-accent/10' : 'border-border hover:border-accent/50 bg-white shadow-sm'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                      {plan.icon}
                    </div>
                    <h3 className="font-black text-lg mb-1">{plan.name}</h3>
                    <p className="text-2xl font-black text-primary mb-4">${plan.price} <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">/ {plan.duration}</span></p>
                    <ul className="space-y-2 mt-auto">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <Card className="rounded-[2.5rem] border-border shadow-xl sticky top-24 overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-2xl font-black italic tracking-tighter">Promotion Order</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {selectedProduct && selectedPlan ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold uppercase tracking-widest opacity-50">
                        <span>Product</span>
                        <span>Price</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-y border-border/50">
                        <span className="font-bold truncate max-w-[150px]">{products.find(p => p.id === selectedProduct)?.title}</span>
                        <span className="font-black text-primary">${PROMOTION_PLANS.find(p => p.id === selectedPlan)?.price}</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="flex justify-between items-baseline mb-8">
                        <span className="text-lg font-bold">Total to Pay</span>
                        <span className="text-4xl font-black text-primary">${PROMOTION_PLANS.find(p => p.id === selectedPlan)?.price}</span>
                      </div>
                      <Button 
                        onClick={handlePromote}
                        disabled={submitting}
                        className="w-full h-16 rounded-full text-lg font-black gap-3 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
                      >
                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                        Pay & Activate
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground font-medium italic">Please select a product and plan to see the summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

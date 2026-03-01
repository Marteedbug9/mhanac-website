import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from '@tanstack/react-router';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard,
  Loader2,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { blink } from '@/lib/blink';
import AddressForm from '@/components/AddressForm';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, total, loading, clearCart } = useCart();
  const [address, setAddress] = useState<any>(null);
  const region = localStorage.getItem('selected_region') || 'us';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const handleCheckout = async () => {
    if (!user) {
      blink.auth.login();
      return;
    }

    if (!address) {
      toast.error('Please provide a shipping address');
      return;
    }

    try {
      const orderId = crypto.randomUUID();
      await blink.db.orders.create({
        id: orderId,
        userId: user.id,
        items: JSON.stringify(items),
        totalAmount: total,
        status: 'pending',
        shippingAddress: JSON.stringify(address)
      });

      await clearCart();
      toast.success('Order placed successfully! (Mock Checkout)');
      navigate({ to: '/orders' });
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/home' })} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart ({items.length})</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90" onClick={() => navigate({ to: '/products' })}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <Card className="rounded-2xl border-border shadow-sm overflow-hidden group">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex gap-4 md:gap-6">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-xl overflow-hidden shrink-0">
                              <img 
                                src={JSON.parse(item.product.images || '[]')[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'} 
                                alt={item.product.title} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="flex justify-between gap-4">
                                <div>
                                  <h3 className="font-bold text-lg md:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                    {item.product.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1 capitalize">{item.product.category} • {item.product.region.toUpperCase()}</p>
                                </div>
                                <p className="font-bold text-lg text-primary shrink-0">
                                  ${(item.product.discount_price || item.product.price) * item.quantity}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center bg-muted rounded-full p-1 border border-border/50">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1.5 hover:text-primary transition-colors rounded-full hover:bg-white"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1.5 hover:text-primary transition-colors rounded-full hover:bg-white"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:bg-destructive/10 rounded-full"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Address Section */}
              <Card className="rounded-3xl border-border shadow-sm p-8 bg-muted/10">
                {!address ? (
                  <AddressForm 
                    userId={user?.id || ''} 
                    region={region} 
                    onComplete={(addr) => setAddress(addr)} 
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Shipping to {region.toUpperCase()}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setAddress(null)} className="text-primary font-bold">Change</Button>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-border shadow-sm">
                      <p className="font-bold">{address.fullName}</p>
                      <p className="text-sm opacity-70">{address.streetAddress}</p>
                      <p className="text-sm opacity-70">{address.city}, {address.stateProvince} {address.postalCode}</p>
                      <p className="text-sm opacity-70">{address.country}</p>
                      <p className="text-sm font-bold text-primary mt-2">{address.phone}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <Card className="rounded-3xl border-border shadow-md sticky top-24 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-border/50">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (Calculated at checkout)</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-14 rounded-full text-lg font-bold gap-3 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    <CreditCard className="w-5 h-5" />
                    Place Order (Demo)
                  </Button>

                  <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      By proceeding to checkout, you agree to Diaspora Deal's Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

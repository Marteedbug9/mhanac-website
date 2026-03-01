import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { 
  Package, 
  ChevronRight, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blink } from '@/lib/blink';
import { useAuth } from '@/hooks/useAuth';

export default function Orders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await blink.db.orders.list({ 
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });
        setOrders(res);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/home' })} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90" onClick={() => navigate({ to: '/products' })}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = JSON.parse(order.items || '[]');
              return (
                <Card key={order.id} className="rounded-2xl border-border shadow-sm overflow-hidden group">
                  <CardHeader className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between p-6">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Order Date</p>
                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-primary">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Order ID</p>
                        <p className="text-sm font-medium opacity-60">#{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full gap-2 px-3 py-1 bg-white capitalize">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={JSON.parse(item.product.images || '[]')[0] || ''} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{item.product.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-sm text-primary">
                            ${(item.product.discount_price || item.product.price) * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border/50 flex justify-end">
                      <Button variant="outline" className="rounded-full px-6">View Order Details</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

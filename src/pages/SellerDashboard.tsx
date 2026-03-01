import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { 
  Store, 
  Package, 
  Plus, 
  LayoutDashboard, 
  Settings, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Megaphone,
  Sparkles,
  BarChart3,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { blink } from '@/lib/blink';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const CATEGORIES = [
  "deals", "electronics", "home_kitchen", "beauty", "fashion", "grocery", "health", "baby_kids", "toys_games", "sports_outdoors", "automotive", "pet_supplies", "tools_home_improvement", "office_school", "services", "wholesale_bulk"
];

const SEASONS = [
  "spring", "autumn", "summer", "winter", "valentine", "christmas"
];

const STATES = ["New", "Used", "Refurbished"];

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    region: 'us',
    stock: '10',
    state: 'New',
    color: '',
    size: '',
    images: [] as string[],
    season: '',
    is_best_seller: false,
    is_on_sale: false,
    isPromoted: false // Added for promotion status
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to access seller portal');
      navigate({ to: '/home' });
    }
    
    const fetchSellerData = async () => {
      if (!user) return;
      try {
        const [sellerData] = await blink.db.sellers.list({ where: { userId: user.id } });
        if (sellerData) {
          setSeller(sellerData);
          const productList = await blink.db.products.list({ where: { userId: user.id } });
          setProducts(productList);
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [user, authLoading]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const file = files[0];
      const { publicUrl } = await blink.storage.upload(
        file, 
        `products/${user?.id}-${Date.now()}-${file.name}`
      );
      setNewProduct(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const productData = {
        ...newProduct,
        id: crypto.randomUUID(),
        userId: user.id,
        price: parseFloat(newProduct.price),
        discountPrice: newProduct.discount_price ? parseFloat(newProduct.discount_price) : null,
        stock: parseInt(newProduct.stock),
        images: JSON.stringify(newProduct.images),
        isBestSeller: newProduct.is_best_seller ? "1" : "0",
        isOnSale: newProduct.is_on_sale ? "1" : "0",
        isPromoted: newProduct.isPromoted ? "1" : "0", // Added for promotion status
      };
      
      await blink.db.products.create(productData as any);
      toast.success('Product added successfully!');
      setShowAddProduct(false);
      // Refresh list
      const productList = await blink.db.products.list({ where: { userId: user.id } });
      setProducts(productList);
      setNewProduct({
        title: '', description: '', price: '', discount_price: '', category: '', region: 'us', stock: '10', state: 'New', color: '', size: '', images: [], season: '', is_best_seller: false, is_on_sale: false, isPromoted: false
      });
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await blink.db.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!seller) {
    return <SellerOnboarding onComplete={(s: any) => setSeller(s)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 space-y-2">
            <h2 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Seller Menu</h2>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl bg-white shadow-sm hover:bg-muted font-bold text-primary"><LayoutDashboard className="w-5 h-5" /> Dashboard</Button>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-muted font-medium"><Package className="w-5 h-5" /> Products</Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 rounded-xl hover:bg-primary hover:text-white font-bold transition-all"
              onClick={() => navigate({ to: '/seller/promote' })}
            >
              <Megaphone className="w-5 h-5" /> Promote Items
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-muted font-medium"><TrendingUp className="w-5 h-5" /> Analytics</Button>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-muted font-medium"><Settings className="w-5 h-5" /> Store Settings</Button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black italic tracking-tighter">Welcome, {seller.shop_name}</h1>
                <p className="text-muted-foreground font-medium">Manage your products and view store insights</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate({ to: '/seller/promote' })} className="rounded-full px-6 gap-2 border-primary text-primary font-bold hover:bg-primary/5">
                  <Rocket className="w-5 h-5" /> Promote
                </Button>
                <Button onClick={() => setShowAddProduct(true)} className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold">
                  <Plus className="w-5 h-5" /> Add Product
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><DollarSign className="w-6 h-6" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase">Total Sales</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent"><Package className="w-6 h-6" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase">Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600"><Users className="w-6 h-6" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase">Orders</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product List */}
            <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-border/50">
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {products.length > 0 ? products.map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                          <img 
                            src={JSON.parse(p.images || '[]')[0] || 'https://via.placeholder.com/150'} 
                            alt={p.title} 
                            className="w-full h-full object-cover"
                          />
                          {Number(p.isPromoted) > 0 && (
                            <div className="absolute top-0 right-0 p-0.5 bg-yellow-400 rounded-bl-md">
                              <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm line-clamp-1">{p.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-primary">${p.price}</span>
                            <Badge variant="outline" className="text-[10px] py-0">{p.category}</Badge>
                            <Badge variant="outline" className="text-[10px] py-0 uppercase">{p.region}</Badge>
                            {Number(p.isPromoted) > 0 && <Badge className="text-[8px] py-0 bg-yellow-400 text-primary border-none">PROMOTED</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full gap-2 text-xs font-bold hover:bg-primary hover:text-white"
                          onClick={() => navigate({ to: '/seller/promote', search: { productId: p.id } })}
                        >
                          <Megaphone className="w-3 h-3" /> Promote
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center space-y-4">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">You haven't added any products yet.</p>
                      <Button variant="outline" onClick={() => setShowAddProduct(true)}>Add your first product</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddProduct(false)}><X className="w-6 h-6" /></Button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                  <Input required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} placeholder="Product Title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                  <Select required value={newProduct.category} onValueChange={v => setNewProduct({...newProduct, category: v})}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price ($)</label>
                  <Input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Discount Price ($)</label>
                  <Input type="number" step="0.01" value={newProduct.discount_price} onChange={e => setNewProduct({...newProduct, discount_price: e.target.value})} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Region</label>
                  <Select required value={newProduct.region} onValueChange={v => setNewProduct({...newProduct, region: v})}>
                    <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">USA</SelectItem>
                      <SelectItem value="haiti">Haiti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Condition</label>
                  <Select required value={newProduct.state} onValueChange={v => setNewProduct({...newProduct, state: v})}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                      {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <Textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Describe your product..." />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Product Images</label>
                <div className="grid grid-cols-4 gap-4">
                  {newProduct.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden relative group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button className="absolute top-1 right-1 bg-destructive p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-all">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Plus className="w-6 h-6 text-muted-foreground" />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90">
                Publish Product
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SellerOnboarding({ onComplete }: { onComplete: (s: any) => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ shop_name: '', shop_description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const sellerData = {
        id: crypto.randomUUID(),
        userId: user.id,
        ...formData,
        status: 'active'
      };
      await blink.db.sellers.create(sellerData as any);
      toast.success('Seller account created!');
      onComplete(sellerData);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardHeader className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Become a Seller</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">Open your shop and start reaching thousands of customers in the Diaspora.</p>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop Name</label>
              <Input required value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} placeholder="e.g. Haiti Electronics Store" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop Description</label>
              <Textarea required value={formData.shop_description} onChange={e => setFormData({...formData, shop_description: e.target.value})} placeholder="What do you sell?" />
            </div>
            <Button type="submit" className="w-full h-12 rounded-full font-bold bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Seller Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return <LayoutDashboard className={className} />;
}

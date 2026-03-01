import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from '@tanstack/react-router';
import { 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blink } from '@/lib/blink';
import { toast } from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string;
  stock: number;
  state: string;
  color: string;
  size: string;
}

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams({ from: '/products/$id' });
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await blink.db.products.get(id);
        setProduct(res as any);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background animate-pulse p-20" />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const images = JSON.parse(product.images || '[]');
  const mainImage = images[selectedImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop';

  const addToCart = async () => {
    if (product) {
      await addItem(product.id, quantity);
      toast.success(`${product.title} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-primary cursor-pointer">{product.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden border-2 border-border/50">
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-primary' : 'border-border/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full text-xs bg-primary/5 text-primary">
                  {product.state}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground">(4.0 / 5)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="p-6 bg-muted/30 rounded-3xl space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">
                  ${product.discount_price || product.price}
                </span>
                {product.discount_price && (
                  <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                    ${product.price}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 py-4 border-y border-border/50">
                <div className="flex items-center bg-background rounded-full border border-border">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  Only <span className="text-primary font-bold">{product.stock} left</span> in stock - order soon!
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={addToCart}
                  className="flex-1 h-14 rounded-full text-lg font-bold gap-3 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-14 h-14 rounded-full border-border hover:bg-muted hover:text-primary">
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Warranty</h4>
                  <p className="text-[10px] text-muted-foreground">1 Year Secure Protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Free Shipping</h4>
                  <p className="text-[10px] text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Return Policy</h4>
                  <p className="text-[10px] text-muted-foreground">30-day Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

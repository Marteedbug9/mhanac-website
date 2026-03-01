import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { Sparkles } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string;
  is_best_seller: boolean;
  is_on_sale: boolean;
  is_promoted: number | string;
}

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const images = JSON.parse(product.images || '[]');
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product.id);
  };

  return (
    <Card 
      className={`group cursor-pointer border-border hover:shadow-elegant transition-all duration-300 ${Number(product.is_promoted) > 0 ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
      onClick={() => navigate({ to: `/products/${product.id}` })}
    >
      <CardContent className="p-0 relative">
        {product.is_on_sale && (
          <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Sale
          </span>
        )}
        {Number(product.is_promoted) > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-yellow-400 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> Promoted
          </span>
        )}
        <div className="aspect-square overflow-hidden bg-muted rounded-t-xl">
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{product.category}</p>
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.price}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="w-full rounded-lg bg-primary hover:bg-primary/90 mt-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
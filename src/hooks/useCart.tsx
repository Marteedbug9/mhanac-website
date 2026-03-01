import React, { createContext, useContext, useState, useEffect } from 'react';
import { blink } from '@/lib/blink';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: any;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const cartItems = await blink.db.cartItems.list({ 
        where: { userId: user.id } 
      });
      
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await blink.db.products.get(item.product_id);
          return {
            id: item.id,
            productId: item.product_id,
            quantity: item.quantity,
            product
          };
        })
      );
      
      setItems(itemsWithProducts.filter(i => i.product));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId: string, quantity: number = 1) => {
    if (!user) {
      blink.auth.login();
      return;
    }

    try {
      const existingItem = items.find(i => i.productId === productId);
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        await blink.db.cartItems.create({
          id: crypto.randomUUID(),
          userId: user.id,
          productId,
          quantity
        });
        await fetchCart();
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId);
    try {
      await blink.db.cartItems.update(itemId, { quantity });
      setItems(items.map(i => i.id === itemId ? { ...i, quantity } : i));
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await blink.db.cartItems.delete(itemId);
      setItems(items.filter(i => i.id !== itemId));
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await blink.db.cartItems.deleteMany({ where: { userId: user.id } });
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const total = items.reduce((acc, item) => {
    const price = item.product.discount_price || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, loading, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

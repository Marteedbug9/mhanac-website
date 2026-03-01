import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { 
  Filter, 
  ChevronDown, 
  Search, 
  Grid2X2, 
  List as ListIcon, 
  SlidersHorizontal 
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { blink } from '@/lib/blink';

interface Product {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string;
  is_best_seller: boolean;
  is_on_sale: boolean;
  state: string;
  color: string;
  size: string;
}

const STATES = ['New', 'Used', 'Refurbished'];
const COLORS = ['Red', 'Blue', 'Black', 'White', 'Green', 'Silver', 'Gold'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Universal'];

export default function ProductList() {
  const { t } = useTranslation();
  const search = useSearch({ from: '/products' }) as any;
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const region = localStorage.getItem('selected_region') || 'us';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const where: any = { region };
        if (search.category) where.category = search.category;
        if (search.season) where.season = search.season;
        if (search.search) where.title = { LIKE: `%${search.search}%` };
        
        const res = await blink.db.products.list({ where });
        
        // Manual filtering for complex filters
        let filtered = res;
        if (selectedStates.length > 0) filtered = filtered.filter(p => selectedStates.includes(p.state));
        if (selectedColors.length > 0) filtered = filtered.filter(p => selectedColors.includes(p.color));
        if (selectedSizes.length > 0) filtered = filtered.filter(p => selectedSizes.includes(p.size));
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedStates, selectedColors, selectedSizes, priceRange, region]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {search.category ? t(search.category) : search.season ? t(search.season) : 'All Products'}
            </h1>
            <p className="text-muted-foreground text-sm">Showing {products.length} products</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="lg:hidden" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort By <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Newest Arrivals</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Customer Rating</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 shrink-0 space-y-8 hidden lg:block`}>
            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2000}
                step={10}
                className="py-4"
              />
              <div className="flex items-center justify-between text-sm font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* State Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Condition</h3>
              <div className="space-y-2">
                {STATES.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`state-${state}`} 
                      checked={selectedStates.includes(state)}
                      onCheckedChange={(checked) => {
                        setSelectedStates(prev => 
                          checked ? [...prev, state] : prev.filter(s => s !== state)
                        )
                      }}
                    />
                    <label htmlFor={`state-${state}`} className="text-sm font-medium">{state}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setSelectedColors(prev => 
                      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                    )}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color) ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => 
                      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                    )}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition-all ${
                      selectedSizes.includes(size) ? 'bg-primary border-primary text-white' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted rounded-xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                <Button onClick={() => {
                  setSelectedStates([]);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setPriceRange([0, 1000]);
                }}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

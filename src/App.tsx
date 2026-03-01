import React from 'react';
import { 
  createRouter, 
  createRoute, 
  createRootRoute, 
  RouterProvider, 
  Outlet 
} from '@tanstack/react-router';
import Navbar from './components/layout/Navbar';
import RegionSelector from './pages/RegionSelector';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';
import PromoteProduct from './pages/PromoteProduct';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { CartProvider } from './hooks/useCart';
import { useTranslation } from 'react-i18next';

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const { i18n } = useTranslation();
    return (
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="bg-primary text-white py-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img src="/images/mhanac logo1.png" alt="MHANAC" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tighter">MHANAC</h3>
                </div>
                <p className="text-sm opacity-70">Connecting you with the best products from USA and Haiti. Professional quality service. Your Diaspora gateway.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Languages</h4>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => i18n.changeLanguage('en')} className="text-sm hover:text-accent transition-colors">English</button>
                  <button onClick={() => i18n.changeLanguage('fr')} className="text-sm hover:text-accent transition-colors">Français</button>
                  <button onClick={() => i18n.changeLanguage('ht')} className="text-sm hover:text-accent transition-colors">Kreyòl</button>
                  <button onClick={() => i18n.changeLanguage('es')} className="text-sm hover:text-accent transition-colors">Español</button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-xs opacity-50">Region</h4>
                <div className="flex items-center gap-4">
                  <img src="https://flagcdn.com/us.svg" alt="USA" className="w-6 h-4 object-cover rounded-sm grayscale hover:grayscale-0 cursor-pointer transition-all" />
                  <img src="https://flagcdn.com/ht.svg" alt="Haiti" className="w-6 h-4 object-cover rounded-sm grayscale hover:grayscale-0 cursor-pointer transition-all" />
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-xs opacity-50">&copy; 2026 MHANAC E-Commerce Group. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    );
  },
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RegionSelector,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$id',
  component: ProductDetails,
});

const sellerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller',
  component: SellerDashboard,
});

const promoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/promote',
  component: PromoteProduct,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: Orders,
});

const routeTree = rootRoute.addChildren([
  indexRoute, 
  homeRoute, 
  productsRoute, 
  productDetailsRoute,
  sellerRoute,
  promoteRoute,
  cartRoute,
  ordersRoute
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
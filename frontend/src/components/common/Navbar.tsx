"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '@/store/useCart';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = {
  Women: ['Trousers', 'T-shirts', 'Skirts', 'Blouses', 'Crop Tops'],
  Men: ['T-shirts', 'Shirts', 'Trousers', 'Sarongs']
};

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Sync Cart
        const syncCart = async () => {
          try {
            // 1. Sync local items to backend (if any)
            const localItems = useCart.getState().items;
            if (localItems.length > 0) {
              await api.post('/cart/sync', { items: localItems });
            }

            // 2. Fetch merged cart from backend
            const response = await api.get('/cart');
            if (response.data && response.data.data && response.data.data.items) {
              useCart.getState().setCart(response.data.data.items);
            }
          } catch (err) {
            console.error("Failed to sync cart", err);
          }
        };
        syncCart();

      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem('user');
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useCart.getState().clearCart();
    window.location.href = '/';
  };

  const isHome = pathname === '/';
  const isFixed = isScrolled || isMobileMenuOpen || !isHome;
  const useDarkText = isFixed;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isFixed
        ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-zinc-100 py-3'
        : 'bg-transparent py-5'
        }`}
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className={`text-2xl font-black tracking-tighter flex items-center z-50 relative transition-colors ${useDarkText ? 'text-indigo-600' : 'text-indigo-400'}`}>
          VILLAGE<span className={`transition-colors ${useDarkText ? 'text-zinc-900' : 'text-white'}`}>VOGUE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 h-full">
          <Link href="/products" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${useDarkText ? 'text-zinc-500 hover:text-indigo-600' : 'text-zinc-200 hover:text-white'}`}>
            Shop Catalog
          </Link>

          {Object.entries(CATEGORIES).map(([category, subCategories]) => (
            <div
              key={category}
              className="relative group h-full flex items-center py-2"
              onMouseEnter={() => setActiveCategory(category)}
            >
              <Link
                href={`/products?category=${category}`}
                className={`flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${useDarkText ? 'text-zinc-500 hover:text-indigo-600' : 'text-zinc-200 hover:text-white'}`}
              >
                {category}
                <ChevronDown size={14} className="ml-1 -mb-[2px] opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              <AnimatePresence>
                {activeCategory === category && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48"
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden py-2">
                      {subCategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/products?category=${category}&sub=${sub}`}
                          className="block px-6 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setActiveCategory(null)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-5 z-50 relative">
          <button className={`p-2 transition-colors ${useDarkText ? 'text-zinc-600 hover:text-indigo-600' : 'text-zinc-200 hover:text-white'}`}>
            <Search size={22} />
          </button>

          {mounted && user ? (
            <div className="flex items-center gap-3">
              <div
                className="relative z-50"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <button className="flex items-center gap-2 p-1 hover:bg-zinc-50 rounded-full transition-all group">
                  <div className="hidden lg:flex flex-col items-end opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className={`text-[10px] font-black max-w-[80px] truncate transition-colors ${useDarkText ? 'text-zinc-900' : 'text-white group-hover:text-zinc-900'}`}>{user.name.split(' ')[0]}</span>
                  </div>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full shadow-sm group-hover:shadow-indigo-100 transition-shadow">
                    <User size={20} />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "circOut" }}
                      className="absolute top-full right-0 pt-4 w-72"
                      style={{ transformOrigin: "top right" }}
                    >
                      <div className="bg-white rounded-[2rem] shadow-2xl shadow-zinc-200/80 border border-zinc-100 overflow-hidden p-6 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 relative">
                          <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-zinc-200">
                            {user.name.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-black text-zinc-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link href="/orders" className="flex items-center gap-3 w-full p-3 text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest group">
                            <Package size={18} className="text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                            <span>My Orders</span>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                            }}
                            className="flex items-center gap-3 w-full p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest group"
                          >
                            <LogOut size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
                            <span>Terminate Session</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link href="/login" className={`p-2 transition-colors ${useDarkText ? 'text-zinc-600 hover:text-indigo-600' : 'text-zinc-200 hover:text-white'}`}>
              <User size={22} />
            </Link>
          )}

          <Link href="/cart" className={`relative p-2 transition-colors ${useDarkText ? 'text-zinc-600 hover:text-indigo-600' : 'text-zinc-200 hover:text-white'}`}>
            <ShoppingBag size={22} />
            {mounted && itemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-indigo-100">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className={`md:hidden p-2 transition-colors ${useDarkText ? 'text-zinc-600' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-100 overflow-hidden absolute top-full left-0 right-0 shadow-xl"
          >
            <div className="flex flex-col p-8 space-y-6">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-black uppercase tracking-[0.25em]">Shop All</Link>

              {Object.entries(CATEGORIES).map(([category, subCategories]) => (
                <div key={category} className="space-y-4">
                  <Link href={`/products?category=${category}`} onClick={() => setIsMobileMenuOpen(false)} className="block text-[11px] font-black uppercase tracking-[0.25em] text-indigo-600">{category}</Link>
                  <div className="pl-4 space-y-3 border-l text-zinc-400 border-zinc-100">
                    {subCategories.map(sub => (
                      <Link
                        key={sub}
                        href={`/products?category=${category}&sub=${sub}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium hover:text-zinc-900"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {user && <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-black uppercase tracking-[0.25em]">My Orders</Link>}
              {!user ? (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-600">Initialize Login</Link>
              ) : (
                <button onClick={handleLogout} className="text-left text-[11px] font-black uppercase tracking-[0.25em] text-rose-600">Terminate Session</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
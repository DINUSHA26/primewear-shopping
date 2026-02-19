"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Recycle, Search } from 'lucide-react';
import { Button } from '@/components/primary/Button';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import api from '@/services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/products?isFeatured=true'),
          api.get('/products?sort=-createdAt')
        ]);

        const mapProduct = (p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          images: p.images,
          category: p.category,
          subCategory: p.subCategory,
          vendorId: typeof p.vendor === 'object' ? p.vendor._id : p.vendor,
          vendorName: typeof p.vendor === 'object' ? p.vendor.name : 'Local Artisan',
          stock: p.stock,
          isFeatured: p.isFeatured
        });

        // Featured: 12 items as requested (3x4 grid)
        setFeaturedProducts(featuredRes.data.data.map(mapProduct).slice(0, 12));

        // New Arrivals: 4 items (1 row)
        setNewArrivals(newRes.data.data.map(mapProduct).slice(0, 4));

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 -mt-24 overflow-x-hidden">
        <div className="container mx-auto">
          <div className="relative h-[70vh] md:h-[85vh] w-full rounded-[24px] md:rounded-[40px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"
              alt="Local Marketplace Hero"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-white/30"
              >
                Direct from the Village Garments
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight"
              >
                Wear the <span className="text-indigo-400">Culture.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-200 text-base md:text-xl max-w-2xl mb-8 md:mb-10 px-4 md:px-0"
              >
                A premium marketplace connecting small-scale artisans with the modern world. Every purchase supports a village family.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products">
                  <Button size="lg" className="rounded-full px-8">
                    Shop Catalog <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: <ShieldCheck className="text-indigo-600" />, title: 'Quality Assured', desc: 'Every product is hand-inspected for quality' },
            { icon: <Truck className="text-indigo-600" />, title: 'Island-wide Delivery', desc: 'Fast and reliable shipping to your doorstep' },
            { icon: <Recycle className="text-indigo-600" />, title: 'Sustainable Fashion', desc: 'Supporting eco-friendly local production' },
            { icon: <ShoppingBag className="text-indigo-600" />, title: 'Direct Impact', desc: '100% of profits help village artisans grow' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4"
            >
              <div className="p-3 bg-white w-fit rounded-xl md:rounded-2xl shadow-sm border border-zinc-100">
                {item.icon}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm md:text-base">{item.title}</h3>
              <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">New Arrivals</h2>
            <p className="text-zinc-500">Fresh from the production line.</p>
          </div>
          <Link href="/products?sort=-createdAt" className="hidden md:flex items-center text-indigo-600 font-bold hover:underline">
            View All <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-zinc-100 rounded-[32px]"></div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
            <p className="text-zinc-500">No new arrivals yet.</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Featured Collections</h2>
            <p className="text-zinc-500">Hand-picked styles from our most talented local garments.</p>
          </div>
          <Link href="/products?isFeatured=true" className="hidden md:flex items-center text-indigo-600 font-bold hover:underline">
            View All <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-zinc-100 rounded-[32px]"></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
            <Search className="mx-auto text-zinc-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-zinc-900">No featured collections</h3>
            <p className="text-zinc-500">Check back soon for curated selections!</p>
          </div>
        )}
      </section>
    </div>
  );
}

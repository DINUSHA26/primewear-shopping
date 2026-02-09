"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/primary/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/store/useCart';
import { Product } from '@/types/product';
import api from '@/services/api';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [mainImageError, setMainImageError] = useState(false);
    const [mainRealError, setMainRealError] = useState(false);
    const addItem = useCart((state) => state.addItem);

    // Reset error states when image changes
    useEffect(() => {
        setMainImageError(false);
        setMainRealError(false);
    }, [selectedImage, product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                const p = response.data.data;
                const mappedProduct: Product = {
                    id: p._id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    images: p.images,
                    category: p.category,
                    vendorId: typeof p.vendor === 'object' ? p.vendor._id : p.vendor,
                    vendorName: typeof p.vendor === 'object' ? p.vendor.name : 'Local Artisan',
                    stock: p.stock
                };
                setProduct(mappedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Garment Specs...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <div className="bg-zinc-50 rounded-[40px] p-16 max-w-2xl mx-auto border-2 border-zinc-200 border-dashed">
                    <h1 className="text-3xl font-black text-zinc-900 mb-4">Product Not Found</h1>
                    <p className="text-zinc-500 mb-8">This item either doesn't exist or has been archived by the vendor.</p>
                    <Button onClick={() => router.push('/products')}>Back to Catalog</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square w-full rounded-[40px] overflow-hidden bg-zinc-100 shadow-2xl shadow-zinc-200/50 border border-zinc-100"
                    >
                        {!mainImageError ? (
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                onError={() => setMainImageError(true)}
                            />
                        ) : !mainRealError ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={() => setMainRealError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-300">
                                <ShoppingBag size={64} />
                            </div>
                        )}
                    </motion.div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-indigo-600 scale-95 shadow-lg' : 'border-transparent hover:border-zinc-200'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} ${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-[0.15em] border border-indigo-100">
                                {product.category}
                            </span>
                            <span className="text-zinc-200">|</span>
                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">By {product.vendorName}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-tight mb-6 tracking-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-end gap-3">
                            <p className="text-4xl font-black text-indigo-600">
                                {formatCurrency(product.price)}
                            </p>
                            <p className="text-zinc-400 text-sm font-bold mb-1 uppercase tracking-tighter">LKR Net</p>
                        </div>
                    </div>

                    <div className="space-y-4 bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entity Description</h3>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1 rounded-2xl h-16 text-[11px] font-black uppercase tracking-[0.2em]" onClick={() => addItem(product)}>
                            <ShoppingBag className="mr-3" size={20} /> Add to Cart
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl h-16 w-16 p-0 border-zinc-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all">
                            <Heart size={20} />
                        </Button>
                    </div>

                    {/* Stock Alert */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Inventory Alert: Only {product.stock} units remaining in the village vault.</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-zinc-100">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100"><Truck size={20} className="text-zinc-400" /></div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Island Logistics</p>
                                <p className="text-[10px] text-zinc-400 mt-1">3-5 Day Standard Ship</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100"><ShieldCheck size={20} className="text-zinc-400" /></div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Secure Vault</p>
                                <p className="text-[10px] text-zinc-400 mt-1">100% Encrypted Pay</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100"><RotateCcw size={20} className="text-zinc-400" /></div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Return Loop</p>
                                <p className="text-[10px] text-zinc-400 mt-1">7-Day Verification</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

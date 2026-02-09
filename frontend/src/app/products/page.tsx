"use client";

import React, { useState, useEffect, Suspense } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Input } from '@/components/primary/Input';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '@/services/api';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';
    const initialSubCategory = searchParams.get('sub') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
    const [priceRange, setPriceRange] = useState<number>(20000);

    // Update state when URL params change
    useEffect(() => {
        const cat = searchParams.get('category');
        const sub = searchParams.get('sub');
        if (cat) setSelectedCategory(cat);
        else setSelectedCategory('All');

        if (sub) setSelectedSubCategory(sub);
        else setSelectedSubCategory('');
    }, [searchParams]);

    // Dynamically derive categories from products
    const dynamicCategories = ['All', 'Men', 'Women'];
    const SUB_CATEGORIES: Record<string, string[]> = {
        Men: ['T-shirts', 'Shirts', 'Trousers', 'Sarongs'],
        Women: ['Trousers', 'T-shirts', 'Skirts', 'Blouses', 'Crop Tops']
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                // The backend returns { success: true, count: ..., data: [...] }
                const mappedProducts = response.data.data.map((p: any) => ({
                    id: p._id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    images: p.images,
                    category: p.category,
                    subCategory: p.subCategory,
                    vendorId: typeof p.vendor === 'object' ? p.vendor._id : p.vendor,
                    vendorName: typeof p.vendor === 'object' ? p.vendor.name : 'Unknown Vendor',
                    stock: p.stock
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        // Text Match (Search Bar)
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category Match
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        // Sub-Category Match (only if a specific sub-category is selected via URL/Nav)
        const matchesSubCategory = !selectedSubCategory || product.subCategory === selectedSubCategory ||
            (product.subCategory && product.subCategory.includes(selectedSubCategory)); // Fallback for flexible matching

        // Price Match
        const matchesPrice = product.price <= priceRange;

        return matchesSearch && matchesCategory && matchesSubCategory && matchesPrice;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Connecting to Garment Network...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6">
            <PageHeader
                title="Explore Collection"
                subtitle="Discover unique garments crafted with passion by local village artisans."
            />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                            <Search size={18} className="mr-2" /> Search
                        </h3>
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                            <Filter size={18} className="mr-2" /> Categories
                        </h3>
                        <div className="space-y-2">
                            {dynamicCategories.map((cat: string) => (
                                <div key={cat}>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSelectedSubCategory(''); // Reset sub-category when changing parent category manually
                                        }}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                            : 'text-zinc-600 hover:bg-zinc-100'
                                            }`}
                                    >
                                        {cat}
                                    </button>

                                    {/* Render Subcategories if Parent is Selected */}
                                    {selectedCategory === cat && SUB_CATEGORIES[cat] && (
                                        <div className="ml-4 mt-2 space-y-1 pl-2 border-l-2 border-zinc-100">
                                            {SUB_CATEGORIES[cat].map((sub) => (
                                                <button
                                                    key={sub}
                                                    onClick={() => setSelectedSubCategory(sub === selectedSubCategory ? '' : sub)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSubCategory === sub
                                                        ? 'text-indigo-600 bg-indigo-50'
                                                        : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                                                        }`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                            <SlidersHorizontal size={18} className="mr-2" /> Price Range
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="range"
                                className="w-full accent-indigo-600 cursor-pointer"
                                min="0"
                                max="20000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                                <span>LKR 0</span>
                                <span className="text-indigo-600">LKR {priceRange.toLocaleString()}+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-zinc-500 font-medium">
                            Showing <span className="text-zinc-900 font-bold">{filteredProducts.length}</span> products
                            {selectedSubCategory && <span className="text-indigo-600 ml-1">in {selectedSubCategory}</span>}
                        </p>
                        <button className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                            Newest Arrivals
                        </button>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                <Search size={32} className="text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                            <p className="text-zinc-500">Try adjusting your search or category filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-6 py-24 text-center">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}

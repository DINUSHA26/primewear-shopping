"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/primary/Button';
import { useCart } from '@/store/useCart';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleCheckout = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login?redirect=/cart');
        } else {
            router.push('/checkout');
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <div className="bg-zinc-50 rounded-[40px] p-16 max-w-2xl mx-auto border-2 border-dashed border-zinc-200">
                    <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={40} className="text-zinc-300" />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 mb-4">Your cart is empty.</h1>
                    <p className="text-zinc-500 mb-10">Looks like you haven't added anything to your cart yet. Explore our unique collections and support local artisans!</p>
                    <Link href="/products">
                        <Button size="lg" className="rounded-full px-12">
                            Browse Products <ArrowRight className="ml-2" size={20} />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6">
            <PageHeader title="Your Shopping Cart" subtitle={`You have ${items.length} items in your bag`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900 rounded-[32px] p-8 text-white sticky top-32">
                        <h3 className="text-xl font-bold mb-8">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span>{formatCurrency(getTotalPrice())}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Shipping</span>
                                <span>Calculated at next step</span>
                            </div>
                            <div className="h-px bg-zinc-800" />
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-indigo-400">{formatCurrency(getTotalPrice())}</span>
                            </div>
                        </div>
                        <Button onClick={handleCheckout} className="w-full bg-white text-zinc-900 hover:bg-zinc-200 rounded-2xl h-14 font-bold">
                            Secure Checkout
                        </Button>
                        <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            <span className="p-1 border border-zinc-800 rounded">VISA</span>
                            <span className="p-1 border border-zinc-800 rounded">MASTERCARD</span>
                            <span className="p-1 border border-zinc-800 rounded">AMEX</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

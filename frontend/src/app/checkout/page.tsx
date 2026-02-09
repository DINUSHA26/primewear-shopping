"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/primary/Button';
import { Input } from '@/components/primary/Input';
import { formatCurrency } from '@/utils/formatCurrency';
import { ArrowLeft, CheckCircle, Truck, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        phone: '',
    });

    useEffect(() => {
        setMounted(true);
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login?redirect=/checkout');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                orderItems: items.map(item => ({
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    vendor: item.vendorId // Ensure this exists in your CartItem type
                })),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                paymentMethod: 'COD',
                totalPrice: getTotalPrice(),
            };

            const response = await api.post('/orders', orderData);

            if (response.data) {
                clearCart();
                router.push('/orders');
            }
        } catch (error: any) {
            console.error('Checkout failed:', error);
            alert(error.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-3xl font-black text-zinc-900 mb-4">Your cart is empty</h1>
                <Link href="/products">
                    <Button>Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <Link href="/cart" className="inline-flex items-center text-zinc-400 hover:text-indigo-600 text-sm font-medium mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Cart
            </Link>

            <h1 className="text-4xl font-black text-zinc-900 mb-12 tracking-tight">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Info */}
                        <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="Full Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street Number, Area, Landmark"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City Name"
                                        required
                                    />
                                    <Input
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="000000"
                                        required
                                    />
                                </div>
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+94 7X XXX XXXX"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900">Payment Method</h2>
                            </div>

                            <div className="p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                    </div>
                                    <span className="font-bold text-zinc-900">Cash on Delivery</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-100 px-2 py-1 rounded-md">Default</span>
                            </div>
                            <p className="mt-4 text-xs text-zinc-500 italic ml-1">
                                *Pay when you receive your items at your doorstep.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm sticky top-32">
                        <h2 className="text-xl font-bold text-zinc-900 mb-6">In Your Cart</h2>
                        <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                        {item.images && item.images[0] ? (
                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Qty: {item.quantity}</p>
                                        <p className="text-sm font-bold text-indigo-600">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-zinc-100">
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Subtotal</span>
                                <span>{formatCurrency(getTotalPrice())}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-zinc-900 pt-2">
                                <span>Grand Total</span>
                                <span className="text-indigo-600">{formatCurrency(getTotalPrice())}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className="w-full mt-8 rounded-2xl h-14 font-black"
                            size="lg"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Place Order'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';
import Link from 'next/link';
import { Button } from '@/components/primary/Button';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    createdAt: string;
    orderItems: OrderItem[];
    totalPrice: number;
    // We can infer status from the first item or handle status per item? 
    // The backend `Order` model has `status` inside `orderItems`, but realistically an order often has a global status or we show distinct statuses.
    // Let's check the backend model again. `Order` schema has `orderItems` with status.
    // We'll aggregate or show based on items. 
    // Wait, the backend model actually has `status` inside `orderItems`.
    // But usually customer sees "Processing" if any item is processing.
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/myorders');
                setOrders(response.data.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Order History...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-6">
                <PageHeader
                    title="Your Orders"
                    subtitle="Track and manage your recent purchases from local garments."
                />
                <div className="container mx-auto px-6 py-24 text-center">
                    <div className="bg-zinc-50 rounded-[40px] p-16 max-w-2xl mx-auto border-2 border-dashed border-zinc-200">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-8">
                            <Package size={40} className="text-zinc-300" />
                        </div>
                        <h1 className="text-3xl font-black text-zinc-900 mb-4">No orders yet.</h1>
                        <p className="text-zinc-500 mb-10">You haven't placed any orders yet. Start exploring our collection!</p>
                        <Link href="/products">
                            <Button size="lg" className="rounded-full px-12">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6">
            <PageHeader
                title="Your Orders"
                subtitle="Track and manage your recent purchases from local garments."
            />

            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {orders.map((order) => {
                    // Determine overall status. 
                    // If all delivered -> Delivered.
                    // If any cancelled -> Cancelled (or mixed).
                    // Default to first item's status or 'Processing'.
                    const mainStatus = order.orderItems[0]?.status || 'Processing';

                    return (
                        <div key={order._id} className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50/50 border-b border-zinc-100">
                                <div>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-lg font-black text-zinc-900 text-[12px] uppercase tracking-wider">#{order._id.slice(-6)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-zinc-900 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                    <div className={`flex items-center space-x-2 font-bold ${mainStatus === 'Delivered' ? 'text-green-600' :
                                            mainStatus === 'Cancelled' ? 'text-red-500' : 'text-amber-500'
                                        }`}>
                                        {mainStatus === 'Delivered' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                        <span>{mainStatus}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-xl font-black text-indigo-600">{formatCurrency(order.totalPrice)}</p>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {order.orderItems.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-zinc-100 rounded-xl overflow-hidden relative">
                                                {/* We don't have item images here unless we populate or store them in orderItems. 
                                                     The Order model stores name, qty, price. 
                                                     Ideally we should store image URL to avoid lookups or populate product.
                                                     Since we might not have it, show a placeholder or try to fetch.
                                                     Wait, typically e-commerce stores a snapshot of the product including image. 
                                                     Let's check Order model again.
                                                 */}
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                                    <Package size={20} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900">{item.name}</p>
                                                <p className="text-xs text-zinc-400">Qty: {item.quantity} • {item.status}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-zinc-700">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}

                                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                                    {/* <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center">
                                        <Package size={16} className="mr-2" /> Track Shipment
                                    </button> */}
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                        Standard Delivery
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

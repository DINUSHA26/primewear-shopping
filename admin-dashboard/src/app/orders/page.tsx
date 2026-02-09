"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { LuPackage, LuTruck, LuCheck, LuX, LuEye, LuPrinter, LuUser, LuMapPin } from 'react-icons/lu';
import Button from '@/components/primary/Button';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [printingOrder, setPrintingOrder] = useState<any>(null);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, itemId: string, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, { itemId, status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePrint = (order: any) => {
        setPrintingOrder(order);
        setTimeout(() => {
            window.print();
            setPrintingOrder(null);
        }, 500);
    };

    if (loading) return (
        <div className="p-12 text-center text-gray-500 font-bold italic animate-pulse">
            Establishing secure connection to logistics server...
        </div>
    );

    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Logistics & Fulfillment</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">
                        {isAdmin ? 'Global platform order oversight.' : 'Process and track your garment shipments.'}
                    </p>
                </div>
                <div className="bg-white px-6 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Orders</span>
                        <span className="text-lg font-black text-blue-600">{orders.length}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Ship</span>
                        <span className="text-lg font-black text-amber-600">
                            {orders.reduce((acc, o) => acc + o.orderItems.filter((i: any) => i.status === 'Processing').length, 0)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {orders.length === 0 ? (
                    <div className="bg-white p-24 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-400 font-bold italic">
                        The order stream is currently silent.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/20 flex flex-wrap justify-between items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Priority Parcel</span>
                                        <span className="font-mono text-base text-gray-800 font-black">#ORD-{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <LuPackage /> Logged: {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex gap-12">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Customer Profile</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                <LuUser className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm font-black text-gray-800">{order.customer?.name || 'Authorized Buyer'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Financial Data</p>
                                        <p className="text-sm font-black text-blue-600">LKR {order.totalPrice?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/30 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5">Product Intelligence</th>
                                            <th className="px-8 py-5">Quantity</th>
                                            <th className="px-8 py-5">Unit Valuation</th>
                                            <th className="px-8 py-5">Current Phase</th>
                                            <th className="px-8 py-5 text-right">Fulfillment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {order.orderItems.map((item: any) => (
                                            <tr key={item._id} className="hover:bg-blue-50/20 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="font-black text-gray-800 text-base">{item.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono font-bold mt-1">SKU: {item.product.slice(-8).toUpperCase()}</div>
                                                </td>
                                                <td className="px-8 py-6 font-bold text-gray-700">{item.quantity} UNITS</td>
                                                <td className="px-8 py-6 font-bold text-gray-700">LKR {item.price.toLocaleString()}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            item.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                item.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                        }`}>
                                                        {item.status === 'Shipped' && <LuTruck className="w-3.5 h-3.5 animate-bounce" />}
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {!isAdmin && (
                                                        <select
                                                            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-black text-gray-700 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all cursor-pointer appearance-none text-center"
                                                            value={item.status}
                                                            onChange={(e) => updateStatus(order._id, item._id, e.target.value)}
                                                        >
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    )}
                                                    {isAdmin && <span className="text-[10px] font-black text-gray-300 italic uppercase">System Locked</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center px-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                            <LuMapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-400 font-black uppercase block tracking-widest">Shipping Destination</span>
                                            <span className="text-xs text-gray-700 font-bold">{order.shippingAddress}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="text-[10px] font-black py-2 px-5 rounded-xl border-gray-200 hover:bg-white"
                                        onClick={() => handlePrint(order)}
                                    >
                                        <LuPrinter /> PRINT SHIPPING LABEL
                                    </Button>
                                    <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                        <LuEye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Print Friendly View (Hidden by default, shown during print) */}
            {printingOrder && (
                <div className="fixed inset-0 bg-white z-[100] p-12 print-only block">
                    <div className="border-4 border-black p-10 max-w-2xl mx-auto space-y-10">
                        <div className="flex justify-between items-start border-b-2 border-black pb-8">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Garment Portal</h1>
                                <p className="font-bold text-sm">Fulfillment Center: #778-LK</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black">#ORD-{printingOrder._id.slice(-8).toUpperCase()}</div>
                                <div className="text-sm font-bold mt-2">DATE: {new Date().toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest mb-4 bg-black text-white px-2 py-1 inline-block">Recipient Information</h3>
                                <p className="text-xl font-black mb-2">{printingOrder.customer?.name || 'Authorized Buyer'}</p>
                                <p className="text-lg font-bold leading-tight">{printingOrder.shippingAddress}</p>
                                <p className="text-sm font-bold mt-2">TEL: {printingOrder.customer?.phoneNumber || 'N/A'}</p>
                            </div>
                            <div className="border-l-2 border-black pl-8">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-4 bg-black text-white px-2 py-1 inline-block">Shipping Service</h3>
                                <p className="text-2xl font-black italic">DOMESTIC PRIORITY</p>
                                <div className="mt-8">
                                    <div className="w-full h-16 bg-black flex items-center justify-center">
                                        <span className="text-white font-mono text-xl tracking-[0.5em]">||||||| | || |||</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-400 pt-8">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Package Contents:</h3>
                            {printingOrder.orderItems.map((item: any) => (
                                <div key={item._id} className="flex justify-between font-bold border-b border-gray-100 py-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>LKR {item.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-8 italic font-bold text-sm">
                            Thank you for shopping on Garment Market. Please scan the QR code on delivery.
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    nav, aside, header, .no-print, button, main > div:not(.print-only) {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                        position: relative !important;
                        inset: 0 !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
}

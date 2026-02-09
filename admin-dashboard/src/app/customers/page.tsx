"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { LuUser, LuTrash2, LuShoppingBag } from 'react-icons/lu';
import Button from '@/components/primary/Button';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/admin/users');
            // Filter only customers
            const allUsers = response.data.data;
            setCustomers(allUsers.filter((u: any) => u.role === 'customer'));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm('Permanently remove this customer from the matrix? This action cannot be undone.')) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer.');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-600/10 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black text-gray-900 tracking-tightest uppercase leading-none">Customer Manager</h2>
                    <p className="text-gray-400 mt-3 font-bold uppercase tracking-[0.2em] text-[10px] italic">Oversee shopper network and consumer data.</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50 overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
                    <h3 className="text-2xl font-black text-gray-800 flex items-center gap-4 tracking-tight">
                        <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-100"><LuUser className="text-xl" /></div>
                        Shopper Network
                    </h3>
                    <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                        Active Nodes: {customers.length}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <tr>
                                <th className="px-10 py-8">Shopper Identity</th>
                                <th className="px-10 py-8">Access Vector</th>
                                <th className="px-10 py-8">Membership Span</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-bold">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-purple-50/20 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="font-black text-gray-900 text-lg uppercase tracking-tight">{customer.name}</div>
                                    </td>
                                    <td className="px-10 py-8 text-gray-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-[10px] text-gray-400 font-black uppercase tracking-widest italic">
                                        {new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button
                                            onClick={() => handleDelete(customer._id)}
                                            className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Remove Customer"
                                        >
                                            <LuTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-medium">
                                        No active shoppers found in the matrix.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

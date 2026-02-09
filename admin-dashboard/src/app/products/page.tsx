"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { LuShirt, LuStore, LuPackage, LuImage, LuPencil, LuTrash2, LuX, LuSave, LuCheck, LuTag, LuDollarSign, LuLayers } from 'react-icons/lu';
import Button from '@/components/primary/Button';
import Input from '@/components/primary/Input';
import TextArea from '@/components/primary/TextArea';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        status: 'active'
    });

    const fetchAllProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching all products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleDelete = async (productId: string) => {
        if (!confirm('Permanently remove this product from the marketplace? This action cannot be undone.')) return;
        try {
            await api.delete(`/products/${productId}`);
            fetchAllProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description || '',
            status: product.status || 'active'
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editingProduct._id}`, editForm);
            setEditingProduct(null);
            fetchAllProducts();
            alert('Product updated successfully.');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product.');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tightest uppercase leading-none">Product Oversight</h2>
                <p className="text-gray-400 mt-2 font-bold uppercase tracking-[0.1em] text-[10px]">Monitor and manage global inventory.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-black text-gray-800 flex items-center gap-3 text-lg tracking-tight">
                        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><LuShirt /></div>
                        Global Product Feed
                    </h3>
                    <div className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        Total Items: {products.length}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-6">Product Info</th>
                                <th className="px-8 py-6">Vendor Origin</th>
                                <th className="px-8 py-6">Category</th>
                                <th className="px-8 py-6">Pricing</th>
                                <th className="px-8 py-6">Availability</th>
                                <th className="px-8 py-6">Admin Control</th>
                                <th className="px-8 py-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm font-bold text-gray-600">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-gray-300 font-medium italic">
                                        No products have been listed yet.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 shadow-sm">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <LuImage />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 leading-tight">{product.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {product._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <LuStore className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="font-bold text-xs">{product.vendor?.garmentDetails?.garmentName || 'Direct Vendor'}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-1 pl-5.5">{product.vendor?.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                <LuTag size={10} /> {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-gray-900">
                                            LKR {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${product.stock > 50 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.stock} units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <LuPencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <LuTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                                {product.status || 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 py-10 overflow-y-auto">
                    <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Modify Product</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{editingProduct.name} (ID: {editingProduct._id.slice(-6)})</p>
                            </div>
                            <button onClick={() => setEditingProduct(null)} className="p-3 bg-gray-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"><LuX className="text-xl" /></button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    icon={<LuPackage />}
                                />
                                <Input
                                    label="Price (LKR)"
                                    name="price"
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    icon={<LuDollarSign />}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Category"
                                    name="category"
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    icon={<LuLayers />}
                                />
                                <Input
                                    label="Stock Quantity"
                                    name="stock"
                                    type="number"
                                    value={editForm.stock}
                                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                    icon={<LuLayers />}
                                />
                            </div>

                            <TextArea
                                label="Description"
                                name="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Product details..."
                                rows={4}
                            />

                            <div className="pt-6 border-t border-gray-50 flex gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 rounded-2xl py-4 font-black uppercase text-[10px] tracking-widest border-gray-100"
                                >
                                    Cancel Changes
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-2xl py-4 font-black uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-black shadow-xl shadow-blue-100"
                                >
                                    Update Product
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

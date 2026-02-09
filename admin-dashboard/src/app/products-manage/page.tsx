"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import Button from '@/components/primary/Button';
import Input from '@/components/primary/Input';
import TextArea from '@/components/primary/TextArea';
import { LuPlus, LuTrash, LuPencil, LuImage } from 'react-icons/lu';

export default function ProductsManagePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        stock: '',
        isFeatured: false,
        images: [] as string[], // Will store uploaded image URLs
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const CATEGORIES: any = {
        Men: ['T-shirts', 'Shirts', 'Trousers', 'Sarongs'],
        Women: ['Trousers', 'T-shirts', 'Skirts', 'Blouses', 'Crop Tops']
    };

    const fetchMyProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let val: any = value;
        if (type === 'checkbox') {
            val = (e.target as HTMLInputElement).checked;
        }

        setFormData(prev => {
            if (name === 'category') {
                return { ...prev, [name]: val, subCategory: '' };
            }
            return { ...prev, [name]: val };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Limit to 5 images
        const selectedFiles = files.slice(0, 5);
        setImageFiles(selectedFiles);

        // Create preview URLs
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleEdit = (product: any) => {
        setEditingId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            subCategory: product.subCategory,
            stock: product.stock,
            isFeatured: product.isFeatured || false,
            images: product.images || []
        });
        setImagePreviews(product.images || []);
        setShowForm(true);
        // We don't load imageFiles because we can't reconstruct File objects from URLs easily,
        // but the logic below simply appends new images if provided.
        // A robust edit would allow deleting existing images individually, but for now we'll
        // assume if they upload new images, we might append or replace.
        // Current logic below: if (imageFiles.length > 0) it uploads them.
        // Then it posts ...formData which has `images`.
        // So existing images are preserved in `formData.images` unless we clear them.
        setImageFiles([]);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: '', subCategory: '', stock: '', isFeatured: false, images: [] });
        setImageFiles([]);
        setImagePreviews([]);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let newImageUrls: string[] = [];

            // Upload new images if any
            if (imageFiles.length > 0) {
                const formDataUpload = new FormData();
                imageFiles.forEach(file => {
                    formDataUpload.append('images', file);
                });

                const uploadResponse = await api.post('/upload/products', formDataUpload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                newImageUrls = uploadResponse.data.data;
            }

            // Combine existing images with new ones
            const finalImages = [...formData.images, ...newImageUrls];

            const submitData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                images: finalImages,
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, submitData);
            } else {
                await api.post('/products', submitData);
            }

            resetForm();
            fetchMyProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/products/${id}`, { status: newStatus });
            fetchMyProducts();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            await api.put(`/products/${id}`, { isFeatured: !currentFeatured });
            fetchMyProducts();
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchMyProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading inventory...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Management</h2>
                    <p className="text-gray-500 mt-1">Add and manage your garment products.</p>
                </div>
                <Button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    variant={showForm ? 'secondary' : 'primary'}
                    className="flex items-center gap-2"
                >
                    {showForm ? 'Close Form' : <><LuPlus /> Add New Product</>}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Cotton Summer Dress"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price (LKR)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                                <Input
                                    label="Stock Level"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Parent Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors text-sm bg-white"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {Object.keys(CATEGORIES).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Sub Category</label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors text-sm bg-white disabled:opacity-50 disabled:bg-gray-100"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {formData.category && CATEGORIES[formData.category]?.map((sub: string) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Feature this product in collections</label>
                            </div>

                        </div>
                        <div className="space-y-4">
                            <TextArea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your product in detail..."
                                rows={5}
                                required
                            />
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Product Images (Max 5)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm"
                                />
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-5 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <Button type="button" variant="secondary" onClick={resetForm} disabled={uploading}>Cancel</Button>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? 'Processing...' : (editingId ? 'Update Product' : 'Upload Product')}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">My Product List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Featured</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm italic">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No products found. Start adding your collection!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <LuImage />
                                                    )}
                                                </div>
                                                <div className="font-bold text-gray-800 not-italic">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800 not-italic">LKR {product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.stock <= 5 ? 'bg-red-600 text-white animate-pulse' :
                                                product.stock <= 10 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-green-50 text-green-700'
                                                }`}>
                                                {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(product._id, product.status)}
                                                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${product.status === 'active'
                                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {product.status === 'active' ? 'Live' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${product.isFeatured
                                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {product.isFeatured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 not-italic">{product.category} {product.subCategory && <span className="text-xs text-gray-400">/ {product.subCategory}</span>}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <LuPencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LuTrash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

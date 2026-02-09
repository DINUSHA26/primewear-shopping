"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/product';
import { useCart } from '@/store/useCart';
import { formatCurrency } from '@/utils/formatCurrency';

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();
    const [imageError, setImageError] = useState(false);
    const [realError, setRealError] = useState(false);
    const [imgSrc, setImgSrc] = useState(item.images && item.images.length > 0 ? item.images[0] : '');

    React.useEffect(() => {
        setImgSrc(item.images && item.images.length > 0 ? item.images[0] : '');
        setImageError(false);
        setRealError(false);
    }, [item.images]);

    return (
        <div className="flex gap-6 p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm transition-hover hover:shadow-md">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-zinc-50 flex-shrink-0">
                {!imageError && imgSrc ? (
                    <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : !realError && imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={() => setRealError(true)}
                    />
                ) : (
                    <div className="flex w-full h-full items-center justify-center bg-zinc-100 text-zinc-300">
                        <ShoppingBag size={32} />
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-zinc-900 mb-1">{item.name}</h3>
                        <p className="text-xs text-zinc-400 mb-2">Category: {item.category}</p>
                        <p className="text-xs text-zinc-500 italic">By {item.vendorName}</p>
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-zinc-900">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <p className="font-extrabold text-lg text-indigo-600">
                        {formatCurrency(item.price * item.quantity)}
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/store/useCart';
import { getImageUrl } from '@/utils/getImageUrl';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCart((state) => state.addItem);
  const [imgSrc, setImgSrc] = React.useState(getImageUrl(product.images[0]));
  const [imageError, setImageError] = React.useState(false);
  const [realError, setRealError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(getImageUrl(product.images[0]));
    setImageError(false);
    setRealError(false);
  }, [product.images]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-100 transition-all hover:shadow-2xl hover:shadow-zinc-200"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
          {!imageError && imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : !realError && imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setRealError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-300">
              <ShoppingBag size={48} />
            </div>
          )}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <Heart size={18} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
          {product.stock < 5 && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                Only {product.stock} left
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-2">{product.category}</p>
          <h3 className="text-zinc-900 font-bold group-hover:text-indigo-600 transition-colors mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-500 mb-4 font-medium italic">By {product.vendorName}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-zinc-900">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
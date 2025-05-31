'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Heart, Minus, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/app/Components/Home/Navbar';
import Link from 'next/link';
import { useWishlist } from '../../contexts/WishlistContext';

interface Variant {
  ram: string;
  price: number;
  qty: number;
  _id?: string;
}

interface Product {
  _id: string;
  name: string;
  variants: Variant[];
  images: string[];
}

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedRam, setSelectedRam] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const BASE_IMAGE_URL = 'http://localhost:5000/';

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/product/${id}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data: Product = await response.json();
          setProduct(data);
          setSelectedRam(data.variants[0]?.ram || '');
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!product) return;

    const wishlistItem = {
      id: product._id,
      name: product.name,
      image:
        product.images && product.images.length > 0
          ? `${BASE_IMAGE_URL}${product.images[0].replace('\\', '/')}`
          : `${BASE_IMAGE_URL}default-image.jpg`,
      price: Math.min(...product.variants.map((v) => v.price)),
    };

    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(wishlistItem);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  const selectedVariant = product.variants.find((v) => v.ram === selectedRam);
  const totalStock = product.variants.reduce((sum, v) => sum + v.qty, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-600 mb-6 sm:mb-8">
            <Link href="/" className="text-gray-800 text-sm sm:text-base">Home</Link>
            <ChevronRight size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Product details</span>
            <ChevronRight size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 flex items-center justify-center aspect-square">
                <Image
                  src={
                    product.images[selectedImage]
                      ? `${BASE_IMAGE_URL}${product.images[selectedImage].replace('\\', '/')}`
                      : '/default-image.jpg'
                  }
                  alt={product.name}
                  width={300} 
                  height={300} 
                  className="object-contain max-h-full max-w-full w-full h-auto"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-50 rounded-xl p-2 sm:p-4 flex items-center justify-center aspect-square w-16 h-16 sm:w-24 sm:h-24 border-2 transition-colors ${
                      selectedImage === index ? 'border-orange-400' : 'border-transparent hover:border-gray-300'
                    } flex-shrink-0`}
                  >
                    <Image
                      src={`${BASE_IMAGE_URL}${img.replace('\\', '/')}`}
                      alt={`Thumbnail ${index + 1}`}
                      width={60} 
                      height={60} 
                      className="object-contain w-full h-auto"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#003F62] mb-3 sm:mb-4">{product.name}</h1>
                <div className="text-2xl sm:text-3xl font-bold text-[#003F62] mb-4 sm:mb-6">
                  ${selectedVariant?.price.toFixed(2) || 'N/A'}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 text-sm sm:text-base">Availability:</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <Check size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">In stock</span>
                  </div>
                </div>
                <p className="text-orange-600 text-xs sm:text-sm">
                  Hurry up! only {totalStock} product{totalStock > 1 ? 's' : ''} left in stock!
                </p>
              </div>

              {/* RAM Options */}
              <div className="space-y-3">
                <label className="text-gray-700 font-medium text-sm sm:text-base">Ram:</label>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedRam(variant.ram)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                        selectedRam === variant.ram
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.ram}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-gray-700 font-medium text-sm sm:text-base">Quantity:</label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Minus size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="w-10 sm:w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Plus size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-4 pt-3 sm:pt-4">
                <button className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-[#EDA415] text-white hover:bg-orange-500 rounded-md transition-colors">
                  Edit product
                </button>
                <button className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-[#EDA415] hover:bg-orange-500 text-white rounded-md transition-colors">
                  Buy it now
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  aria-label={`Toggle wishlist for ${product.name}`}
                >
                  <Heart
                    size={18} 
                    className={`${
                      isInWishlist(product._id) ? 'text-red-600 fill-red-600' : 'text-gray-600'
                    } w-5 h-5 sm:w-6 sm:h-6`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
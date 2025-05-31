import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify'; 

interface Variant {
  id: string;
  ram: string;
  price: string;
  qty: number;
}

interface Subcategory {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcategories: Subcategory[];
  onProductAdded?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, subcategories, onProductAdded }) => {
  const [title, setTitle] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', ram: '', price: '', qty: 1 }
  ]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const token = localStorage.getItem('token');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSelectedSubcategory('');
      setDescription('');
      setVariants([{ id: '1', ram: '', price: '', qty: 1 }]);
      setUploadedImages([]);
    }
  }, [isOpen]);

  // Add a variant
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      ram: '',
      price: '',
      qty: 1
    };
    setVariants([...variants, newVariant]);
  };

  // Remove variant
  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(variant => variant.id !== id));
    }
  };

  // Update variant field
  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(variants.map(variant =>
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

  // Increment/decrement qty
  const incrementQty = (id: string) => {
    updateVariant(id, 'qty', variants.find(v => v.id === id)!.qty + 1);
  };
  const decrementQty = (id: string) => {
    const variant = variants.find(v => v.id === id)!;
    if (variant.qty > 1) {
      updateVariant(id, 'qty', variant.qty - 1);
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedImages([...uploadedImages, ...Array.from(files)]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter the product title.');
      return;
    }
    if (!selectedSubcategory) {
      toast.error('Please select a subcategory.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', title);
      formData.append('subCategory', selectedSubcategory);
      formData.append('variants', JSON.stringify(variants));

      uploadedImages.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('http://localhost:5000/api/product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error('Error: ' + (err.error || 'Failed to add product'));
        return;
      }

      toast.success('Product added successfully!');
      setTitle('');
      setSelectedSubcategory('');
      setVariants([{ id: '1', ram: '', price: '', qty: 1 }]);
      setUploadedImages([]);
      setDescription('');
      if (onProductAdded) {
        onProductAdded();
      }
      onClose();
      
      // Refresh the entire page
      window.location.reload();
    } catch (error) {
      toast.error('Failed to add product: ' + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-2xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Title :
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="HP AMD Ryzen 3"
              className="w-full h-9 sm:h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Subcategory */}
          <div>
            <label htmlFor="subCategory" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Subcategory :
            </label>
            <select
              id="subCategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full h-9 sm:h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm"
            >
              <option value="" disabled>Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Variants :</label>
              <button
                onClick={addVariant}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Add variants
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-3">
                    <label className="text-xs sm:text-sm text-gray-600">Ram:</label>
                    <input
                      type="text"
                      value={variant.ram}
                      onChange={(e) => updateVariant(variant.id, 'ram', e.target.value)}
                      placeholder="4 GB"
                      className="mt-1 w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs sm:text-sm text-gray-600">Price:</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                        placeholder="529.99"
                        className="w-full h-9 px-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs sm:text-sm text-gray-600">QTY:</label>
                    <div className="mt-1 flex items-center">
                      <button
                        onClick={() => decrementQty(variant.id)}
                        className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-10 sm:w-12 h-7 sm:h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white text-xs sm:text-sm">
                        {variant.qty}
                      </div>
                      <button
                        onClick={() => incrementQty(variant.id)}
                        className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {variants.length > 1 && (
                    <div className="sm:col-span-2">
                      <button
                        onClick={() => removeVariant(variant.id)}
                        className="mt-6 w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-3 sm:w-4 h-3 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Description :
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The Ryzen 7 is a more high-end processor that compares to the Intel..."
              className="w-full h-16 sm:h-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-xs sm:text-sm"
            />
          </div>

          {/* Upload image */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Upload image :
            </label>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {uploadedImages.map((file, index) => {
                const imageURL = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative">
                    <img
                      src={imageURL}
                      alt={`Upload ${index + 1}`}
                      className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-4 sm:w-5 h-4 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X className="w-2 sm:w-3 h-2 sm:h-3" />
                    </button>
                  </div>
                );
              })}

              <label className="w-12 sm:w-16 h-12 sm:h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-1.5 sm:py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-xs sm:text-sm"
          >
            DISCARD
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 sm:px-8 py-1.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-xs sm:text-sm"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
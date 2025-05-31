'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface Category {
  _id: string;
  name: string;
}

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubcategoryAdded: () => void;
  categories: Category[];
}

export const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({
  isOpen,
  onClose,
  onSubcategoryAdded,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category.');
      return;
    }
    if (!subcategoryName.trim()) {
      toast.error('Please enter a subcategory name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/subcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: subcategoryName,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add subcategory');
      }

      toast.success('Subcategory added successfully!');
      setSelectedCategory('');
      setSubcategoryName('');
      onSubcategoryAdded();
      onClose();
    } catch (error) {
      toast.error('Failed to add subcategory: ' + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-[90%] sm:max-w-md border border-gray-300">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add Subcategory</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="category" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Category :
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 sm:h-10 px-3 py-2 border border-gray-300 rounded focus:ring-0 focus:border-gray-300 outline-none text-xs sm:text-sm"
            >
              <option value="" disabled>Select a category</option>
              {categories
                .filter((category) => category._id !== 'all')
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategoryName" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Subcategory Name :
            </label>
            <input
              id="subcategoryName"
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full h-9 sm:h-10 px-3 py-2 border border-gray-300 rounded focus:ring-0 focus:border-gray-300 outline-none text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors"
          >
            DISCARD
          </button>
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-medium transition-colors"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;
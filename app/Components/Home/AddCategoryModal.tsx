'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void; // Callback to refresh categories after adding
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // attach token here
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add category');
      }

      toast.success('Category added successfully!');
      setCategoryName('');
      onCategoryAdded(); // Trigger refresh of categories
      onClose();
    } catch (error) {
      toast.error('Failed to add category: ' + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white w-full max-w-[90%] sm:max-w-md border border-gray-300 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add Category</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Category Name */}
          <div>
            <label htmlFor="categoryName" className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Category Name :
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full rounded h-9 sm:h-10 px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-300 outline-none text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors"
          >
            DISCARD
          </button>
          <button
            onClick={handleSubmit}
            className="bg-orange-500 rounded-2xl hover:bg-orange-600 text-white px-6 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
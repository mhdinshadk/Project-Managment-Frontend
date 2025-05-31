"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaChevronDown, FaChevronRight } from "react-icons/fa";
import ProductModal from "./AddProductModal";
import AddCategoryModal from "./AddCategoryModal";
import AddSubcategoryModal from "./AddSubcategoryModal";
import { useWishlist } from "../../contexts/WishlistContext";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Variant {
  ram: string;
  price: number;
  qty: number;
  _id?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
}

interface Product {
  _id: string;
  name: string;
  subCategory: {
    _id: string;
    name: string;
    category: string;
  };
  variants: Variant[];
  images: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const ProductList: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState<boolean>(false);

  const BASE_IMAGE_URL = "http://localhost:5000/";
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/Subcategories"),
        fetch(`http://localhost:5000/api/products?page=${currentPage}&limit=${rowsPerPage}`),
      ]);

      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
      if (!subcategoriesRes.ok) throw new Error("Failed to fetch subcategories");
      if (!productsRes.ok) throw new Error("Failed to fetch products");

      const categoriesData: Category[] = await categoriesRes.json();
      const subcategoriesData: Subcategory[] = await subcategoriesRes.json();
      const productsData: ProductsResponse = await productsRes.json();

      setCategories([{ _id: "all", name: "All Categories" }, ...categoriesData]);
      setSubcategories(subcategoriesData);
      setProducts(productsData.products);
      setTotalPages(productsData.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage]);

  const filteredProducts = selectedSubcategories.length > 0
    ? products.filter((product) => selectedSubcategories.includes(product.subCategory._id))
    : selectedCategory && selectedCategory !== "all"
    ? products.filter((product) =>
        subcategories.some(
          (sub) => sub.category._id === selectedCategory && sub._id === product.subCategory._id
        )
      )
    : products;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    setSelectedCategory(categoryId);
    setSelectedSubcategories([]);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
    setCurrentPage(1);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/Productdetail/${productId}`);
  };

  const handleWishlistToggle = async (product: Product) => {
    const wishlistItem: WishlistItem = {
      id: product._id,
      name: product.name,
      image:
        product.images && product.images.length > 0
          ? `${BASE_IMAGE_URL}${product.images[0].replace("\\", "/")}`
          : `${BASE_IMAGE_URL}Laptop.png`,
      price: Math.min(...product.variants.map((v) => v.price)),
    };

    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(wishlistItem);
    }
  };

  const maxPagesToShow = 10;
  const pageNumbers = Array.from({ length: Math.min(maxPagesToShow, totalPages) }, (_, i) => i + 1);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <span className="text-gray-600">Home</span>
          <span className="text-gray-600">{">"}</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-[#F5A623] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-yellow-600 transition text-xs sm:text-sm"
          >
            Add category
          </button>
          <button
            onClick={() => setIsSubcategoryModalOpen(true)}
            className="bg-[#F5A623] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-yellow-600 transition text-xs sm:text-sm"
          >
            Add subcategory
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="bg-[#F5A623] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-yellow-600 transition text-xs sm:text-sm"
          >
            Add product
          </button>
        </div>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        subcategories={subcategories}
      />
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={fetchData}
      />
      <AddSubcategoryModal
        isOpen={isSubcategoryModalOpen}
        onClose={() => setIsSubcategoryModalOpen(false)}
        onSubcategoryAdded={fetchData}
        categories={categories}
      />

      <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">
        <div className="w-full sm:w-1/5 pr-0 sm:pr-6 mb-4 sm:mb-0 overflow-y-auto max-h-[calc(100vh-150px)]">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-700">Categories</h3>
          {categories.map((category) => (
            <div key={category._id} className="mb-2">
              <div
                className={`flex items-center justify-between cursor-pointer p-2 rounded text-xs sm:text-sm ${
                  selectedCategory === category._id ? "font-bold text-black" : "text-gray-700"
                }`}
                onClick={() => toggleCategory(category._id)}
              >
                <span>{category.name}</span>
                {category._id !== "all" &&
                  (expandedCategories.includes(category._id) ? (
                    <FaChevronDown className="text-gray-500 w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <FaChevronRight className="text-gray-500 w-3 h-3 sm:w-4 sm:h-4" />
                  ))}
              </div>
              {expandedCategories.includes(category._id) && category._id !== "all" && (
                <div className="ml-4 mt-1">
                  {subcategories
                    .filter((sub) => sub.category._id === category._id)
                    .map((sub) => (
                      <label key={sub._id} className="flex items-center p-2 cursor-pointer rounded text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub._id)}
                          onChange={() => handleSubcategoryChange(sub._id)}
                          className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-600">{sub.name}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-full sm:w-4/5 overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-lg shadow-sm p-3 sm:p-4 relative border border-gray-200 cursor-pointer hover:shadow-md transition"
                onClick={() => handleProductClick(product._id)}
              >
                <button
                  className="absolute top-2 right-2 rounded-full p-1.5 sm:p-2 border border-gray-300 focus:outline-none"
                  aria-label={`Toggle wishlist for ${product.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product);
                  }}
                >
                  <FaHeart
                    className={`text-base sm:text-lg ${
                      isInWishlist(product._id) ? "text-red-600" : "text-gray-600"
                    } hover:text-blue-600 transition-colors w-4 h-4 sm:w-5 sm:h-5`}
                  />
                </button>
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${BASE_IMAGE_URL}${product.images[0].replace("\\", "/")}`
                      : "/Laptop.png"
                  }
                  alt={product.name}
                  className="w-full h-32 sm:h-40 object-contain mb-3 sm:mb-4"
                  loading="lazy"
                />
                <h3 className="text-[#003F62] font-semibold text-xs sm:text-sm">{product.name}</h3>
                <p className="text-[#4A4A4A] font-bold text-base sm:text-lg">
                  ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
                </p>

                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < 4 ? "text-yellow-500" : "text-gray-500"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <p className="text-gray-600 text-xs sm:text-sm">
              {filteredProducts.length} of {products.length} items
            </p>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-xs sm:text-sm ${
                    currentPage === page ? "bg-yellow-400 text-black" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > maxPagesToShow && <span className="text-gray-600 mx-1 text-xs sm:text-sm">...</span>}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-xs sm:text-sm">Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-[#EDA415] px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded"
              >
                {[3, 6, 9, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} rows
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
"use client";

import { Heart, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWishlist } from "../../contexts/WishlistContext";

const Navbar: React.FC = () => {
  const cartCount = 3; // Replace with dynamic cart count if needed
  const router = useRouter();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const BASE_IMAGE_URL = "http://localhost:5000/";
  const { wishlist, removeFromWishlist } = useWishlist();

  const handleSignIn = () => {
    router.push("/login");
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  return (
    <>
      <nav className="bg-[#004066] py-2 sm:py-3 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="flex ml-0 lg:ml-74 items-center w-full sm:w-[400px] bg-white rounded-full overflow-hidden h-10 sm:h-12">
          <input
            type="text"
            placeholder="Search any things"
            className="flex-1 px-3 sm:px-4 text-xs sm:text-sm outline-none text-black"
          />
          <button className="bg-[#F5A623] text-white px-4 sm:px-6 h-full text-xs sm:text-sm font-semibold">
            Search
          </button>
        </div>

        <div className="flex mr-0 lg:mr-24 items-center space-x-2 sm:space-x-4 text-white text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative cursor-pointer" onClick={toggleWishlist}>
              <Heart size={16} className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F5A623] text-white text-[8px] sm:text-[10px] font-semibold w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>
            <button onClick={handleSignIn} className="text-white hover:underline">
              Sign In
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <ShoppingCart size={16} className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F5A623] text-white text-[8px] sm:text-[10px] font-semibold w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </div>
        </div>
      </nav>

      {isWishlistOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-end z-50 p-4 sm:p-6">
          <div className="bg-white w-full sm:w-96 h-full p-4 sm:p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Wishlist</h2>
              <button onClick={toggleWishlist}>
                <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm">Your wishlist is empty.</p>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start mb-3 sm:mb-4 p-3 sm:p-4 border rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 sm:w-24 h-16 sm:h-24 mr-3 sm:mr-4 object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-xs sm:text-sm font-semibold">{item.name}</h3>
                      <button onClick={() => removeFromWishlist(item.id)}>
                        <X size={14} className="text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-gray-800">${item.price.toFixed(2)}</p>
                    <div className="flex items-center text-yellow-500 mb-1 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4 1 5.5z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
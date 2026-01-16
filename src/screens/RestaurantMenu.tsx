import React, { useEffect, useState } from 'react';
import { FoodItem } from '../types';
import { fetchDishByRestaurant } from '../api/restaurants';
import { useCart } from '../context/CartContext';

interface RestaurantMenuProps {
  restaurantId: number;
  restaurantName: string;
  onBack: () => void;
  onSelectProduct: (item: FoodItem) => void;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ 
  restaurantId, 
  restaurantName, 
  onBack,
  onSelectProduct 
}) => {
  const [dishes, setDishes] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  useEffect(() => {
    loadDishes();
  }, [restaurantId]);

  const loadDishes = async () => {
    try {
      setLoading(true);
      const data = await fetchDishByRestaurant(restaurantId);
      setDishes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: FoodItem, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(item, 1);
    setAddedToCartId(item.id);
    setTimeout(() => setAddedToCartId(null), 1500);
  };

  if (loading) return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="text-center">
        <span className="material-icons-round text-6xl text-gray-400 animate-spin block mb-4">
          autorenew
        </span>
        <p className="text-[#9a734c] font-bold">Loading menu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-red-600">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-8">
      {/* Header with back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#ec8013] hover:text-[#d67210] font-bold mb-4 transition-colors"
        >
          <span className="material-icons-round">arrow_back</span>
          Back to Restaurants
        </button>
        <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">
          {restaurantName}
        </h1>
        <p className="text-[#9a734c] mt-2">
          {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'} available
        </p>
      </div>

      {/* Menu Grid */}
      {dishes.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-icons-round text-6xl text-gray-300 block mb-4">
            restaurant_menu
          </span>
          <p className="text-[#9a734c] text-lg">No dishes available at this restaurant</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#f3ede7] flex flex-col group cursor-pointer"
              onClick={() => onSelectProduct(dish)}
            >
              <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden">
                <img
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  src={dish.image}
                />
              </div>

              <div className="flex-grow space-y-2">
                <div className="text-[10px] font-black text-[#9a734c] uppercase tracking-widest">
                  {dish.category || 'Uncategorized'}
                </div>
                <h3 className="font-bold text-lg text-[#1b140d] leading-tight line-clamp-2">
                  {dish.name}
                </h3>
                {dish.description && (
                  <p className="text-sm text-[#9a734c] line-clamp-2">
                    {dish.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#f3ede7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[#ec8013] font-black text-xl">
                    ${dish.price.toFixed(2)}
                  </div>
                  {dish.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="material-icons-round text-yellow-500 text-sm">star</span>
                      <span className="font-bold text-[#1b140d]">{dish.rating}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(dish, e)}
                  className={`w-full py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm ${
                    addedToCartId === dish.id
                      ? 'bg-green-500 text-white'
                      : 'bg-[#ec8013] text-white hover:bg-[#d67210]'
                  }`}
                >
                  {addedToCartId === dish.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="material-icons-round text-sm">check</span>
                      Added!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <span className="material-icons-round text-sm">add_shopping_cart</span>
                      Add to Cart
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;

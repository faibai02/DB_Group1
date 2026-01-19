import React, { useEffect, useState } from 'react';
import { FoodItem } from '../types';
import { fetchMenu } from '../api/menu';
import { fetchRestaurants, RestaurantRow } from '../api/restaurants';
import { fetchCategories, Category } from '../api/categories';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  onSelectProduct: (item: FoodItem) => void;
  onNavigateToRestaurants?: () => void;
}

const Home: React.FC<HomeProps> = ({ onSelectProduct, onNavigateToRestaurants }) => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchMenu(), fetchRestaurants(), fetchCategories()])
      .then(([dishesData, restaurantsData, categoriesData]) => {
        setItems(dishesData);
        setRestaurants(restaurantsData);
        setCategories(categoriesData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (item: FoodItem, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(item, 1);
    setAddedToCartId(item.id);
    setTimeout(() => setAddedToCartId(null), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-icons-round text-6xl text-gray-400 animate-spin block mb-4">
            autorenew
          </span>
          <p className="text-[#9a734c] font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ec8013] to-[#d67210] shadow-xl">
        <div className="p-8 md:p-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Welcome to Foodie
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Discover delicious meals from {restaurants.length} restaurants. Order now and get it delivered fast!
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <div className="text-2xl font-black">{items.length}</div>
              <div className="text-sm">Dishes Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <div className="text-2xl font-black">{restaurants.length}</div>
              <div className="text-sm">Restaurants</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
              <div className="text-2xl font-black">{categories.length}</div>
              <div className="text-sm">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-black text-[#1b140d] mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const categoryItems = items.filter(item => item.category === category.name);
              const firstItem = categoryItems[0];
              return (
                <button
                  key={category.category_id}
                  onClick={() => firstItem && onSelectProduct(firstItem)}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-[#ec8013]"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <div className="text-white font-black text-sm">{category.name}</div>
                    <div className="text-white/80 text-xs">{categoryItems.length} items</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* All Dishes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#1b140d]">All Dishes</h2>
          <span className="text-sm text-[#9a734c]">{items.length} dishes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#f3ede7] flex flex-col group cursor-pointer"
              onClick={() => onSelectProduct(item)}
            >
              <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  src={item.image}
                />
              </div>

              <div className="flex-grow space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-[#9a734c] uppercase tracking-widest">
                    {item.category || 'Uncategorized'}
                  </div>
                  {item.restaurant && (
                    <div className="text-[10px] font-bold text-[#ec8013]">
                      {item.restaurant}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-[#1b140d] leading-tight line-clamp-2">
                  {item.name}
                </h3>
              </div>

              <div className="mt-4 pt-4 border-t border-[#f3ede7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[#ec8013] font-black text-xl">
                    ${item.price.toFixed(2)}
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="material-icons-round text-yellow-500 text-sm">star</span>
                      <span className="font-bold text-[#1b140d]">{item.rating}</span>
                    </div>
                  )}
                </div>

                {isLoggedIn ? (
                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className={`w-full py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm ${
                      addedToCartId === item.id
                        ? 'bg-green-500 text-white'
                        : 'bg-[#ec8013] text-white hover:bg-[#d67210]'
                    }`}
                  >
                    {addedToCartId === item.id ? (
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
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <span className="material-icons-round text-sm">lock</span>
                      Login to Order
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

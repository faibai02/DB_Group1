import React, { useEffect, useState } from 'react';

interface Restaurant {
  restaurant_id: number;
  name: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
}

interface RestaurantsProps {
  onSelectRestaurant: (restaurantId: number, name: string) => void;
}

const Restaurants: React.FC<RestaurantsProps> = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:6969/restaurant');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      setRestaurants(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading restaurants...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Restaurants</h1>
        <p className="text-[#9a734c] mt-2">Choose from {restaurants.length} restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.restaurant_id}
            onClick={() => onSelectRestaurant(restaurant.restaurant_id, restaurant.name)}
            className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden hover:shadow-lg hover:border-[#ec8013] transition-all transform hover:scale-105 cursor-pointer group"
          >
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-[#f3ede7] to-[#e8ddd5] relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${restaurant.name}/400/200`}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-black text-[#1b140d] text-left">{restaurant.name}</h2>
              </div>

              {restaurant.address && (
                <div className="flex items-start gap-2">
                  <span className="material-icons-round text-[#ec8013] text-lg shrink-0">location_on</span>
                  <p className="text-sm text-[#9a734c] text-left">{restaurant.address}</p>
                </div>
              )}

              {restaurant.phone && (
                <div className="flex items-start gap-2">
                  <span className="material-icons-round text-[#ec8013] text-lg shrink-0">phone</span>
                  <p className="text-sm text-[#9a734c] text-left">{restaurant.phone}</p>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#ec8013]/10 text-[#ec8013] text-xs font-bold uppercase tracking-wider">
                  ⭐ 4.5
                </span>
                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-wider">
                  Open
                </span>
              </div>

              <div className="text-[#ec8013] font-black text-sm group-hover:text-[#d67210] transition-colors flex items-center justify-between">
                <span>View Menu</span>
                <span className="material-icons-round">arrow_forward</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;

import React, { useEffect, useState } from 'react';
import { FoodItem } from '../types';
import { fetchMenu } from '../api/menu';

interface HomeProps {
  onSelectProduct: (item: FoodItem) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectProduct }) => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading menu…</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-12">
      {/* Action Chips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-3 py-4 px-6 bg-white border border-[#f3ede7] rounded-xl hover:shadow-md hover:border-[#ec8013] transition-all group">
          <span className="material-icons-round text-[#ec8013] group-hover:scale-110 transition-transform">favorite_border</span>
          <span className="font-bold text-[#1b140d]">Favorites</span>
        </button>
        <button className="flex items-center justify-center gap-3 py-4 px-6 bg-white border border-[#f3ede7] rounded-xl hover:shadow-md hover:border-[#ec8013] transition-all group">
          <span className="material-icons-round text-[#ec8013] group-hover:scale-110 transition-transform">history</span>
          <span className="font-bold text-[#1b140d]">History</span>
        </button>
        <button className="flex items-center justify-center gap-3 py-4 px-6 bg-white border border-[#f3ede7] rounded-xl hover:shadow-md hover:border-[#ec8013] transition-all group">
          <span className="material-icons-round text-[#ec8013] group-hover:scale-110 transition-transform">receipt_long</span>
          <span className="font-bold text-[#1b140d]">Orders</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f3ede7] shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col items-start z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#1b140d] leading-tight">
              Order anywhere,<br/>
              <span className="text-[#ec8013]">anytime!</span>
            </h1>
            <p className="text-lg text-[#9a734c] max-w-md">
              Fresh ingredients, delicious meals, delivered straight to your doorstep in minutes.
            </p>
            <button
              onClick={() => items[2] && onSelectProduct(items[2])}
              className="bg-[#ec8013] hover:bg-[#d67210] text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Order Now
              <span className="material-icons-round">arrow_forward</span>
            </button>
            <div className="flex gap-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-[#1b140d]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-96 relative w-full">
            <img
              alt="Fresh food composition"
              className="absolute inset-0 w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f3ede7] via-transparent to-transparent md:w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Categories / Hottest Lunches */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1b140d] flex items-center gap-2">
            Hottest Lunches
            <span className="material-icons-round text-[#ec8013]">local_fire_department</span>
          </h2>
          <button className="text-[#ec8013] hover:text-[#d67210] font-bold flex items-center gap-1 text-sm transition-colors">
            View All
            <span className="material-icons-round text-base">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer text-center"
              onClick={() => onSelectProduct(item)}
            >
              <div className="aspect-square w-full overflow-hidden rounded-full border-4 border-transparent group-hover:border-[#ec8013] transition-all shadow-sm">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={item.image}
                />
              </div>
              <h3 className="mt-3 text-base font-bold text-[#1b140d]">{item.name}</h3>
            </div>
          ))}

          <div className="group cursor-pointer text-center hidden lg:block">
            <div className="aspect-square w-full overflow-hidden rounded-full border-4 border-transparent group-hover:border-[#ec8013] transition-all shadow-sm">
              <img
                alt="Drinks"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
              />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1b140d]">Drinks</h3>
          </div>
        </div>
      </section>

      {/* Order Again */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1b140d]">Order Again</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-[#f3ede7] hover:bg-gray-100 transition-colors">
              <span className="material-icons-round text-gray-600">arrow_back</span>
            </button>
            <button className="p-2 rounded-full border border-[#f3ede7] hover:bg-gray-100 transition-colors">
              <span className="material-icons-round text-gray-600">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <div
              key={`again-${item.id}`}
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#f3ede7] flex flex-col items-center text-center group cursor-pointer"
              onClick={() => onSelectProduct(item)}
            >
              <div className="relative w-40 h-40 mb-4">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full shadow-md transition-transform group-hover:scale-105"
                  src={item.image}
                />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-[#f3ede7]">
                  <span className="material-icons-round text-[#ec8013] text-sm">favorite</span>
                </div>
              </div>
              <div className="text-[10px] font-black text-[#9a734c] uppercase tracking-widest mb-1">
                {item.restaurant}
              </div>
              <h3 className="font-bold text-lg text-[#1b140d] mb-1 leading-tight">{item.name}</h3>
              <div className="text-[#ec8013] font-black text-xl mb-4">${item.price.toFixed(2)}</div>
              <button className="w-full py-2 rounded-xl bg-[#f3ede7] text-[#1b140d] hover:bg-[#ec8013] hover:text-white transition-all text-sm font-bold shadow-sm">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

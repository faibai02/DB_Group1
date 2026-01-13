
import React, { useState } from 'react';
import { FoodItem } from '../types';
import { MOCK_ITEMS } from '../constants';

interface ProductDetailProps {
  item: FoodItem;
  onCheckout: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ item, onCheckout }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Large');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const totalPrice = (item.price + (size === 'Large' ? 2 : size === 'Double' ? 4.5 : 0)) * quantity;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#9a734c] flex items-center gap-2">
        <span className="hover:text-[#ec8013] cursor-pointer">Home</span>
        <span className="material-icons-round text-xs">chevron_right</span>
        <span className="hover:text-[#ec8013] cursor-pointer">{item.category}</span>
        <span className="material-icons-round text-xs">chevron_right</span>
        <span className="text-[#1b140d] font-bold">{item.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden bg-white relative shadow-sm border border-[#f3ede7]">
            <img 
              alt={item.name} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              src={item.image} 
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur text-[#1b140d] shadow-sm">
                <span className="material-icons-round text-orange-500 text-sm mr-1">local_fire_department</span>
                Popular
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3].map((i) => (
              <button key={i} className={`relative rounded-2xl overflow-hidden aspect-square border-2 ${i === 1 ? 'border-[#ec8013]' : 'border-transparent opacity-70 hover:opacity-100 transition-opacity'}`}>
                <img alt="Thumbnail" className="w-full h-full object-cover" src={item.image} />
              </button>
            ))}
            <button className="relative rounded-2xl overflow-hidden aspect-square bg-[#f3ede7] flex items-center justify-center text-[#9a734c] hover:bg-gray-200 transition-colors">
              <span className="material-icons-round">play_arrow</span>
            </button>
          </div>
        </div>

        {/* Right: Info & Customization */}
        <div className="mt-10 lg:mt-0 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">{item.name}</h1>
              <p className="text-[#9a734c] font-medium flex items-center gap-1.5">
                <span className="material-icons-round text-lg">storefront</span> 
                {item.restaurant}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#ec8013]">${item.price.toFixed(2)}</p>
              <div className="mt-1 flex items-center justify-end text-sm text-[#9a734c]">
                <div className="flex text-yellow-400">
                  <span className="material-icons-round text-sm">star</span>
                  <span className="material-icons-round text-sm">star</span>
                  <span className="material-icons-round text-sm">star</span>
                  <span className="material-icons-round text-sm">star</span>
                  <span className="material-icons-round text-sm">star_half</span>
                </div>
                <p className="ml-1.5">({item.reviews} reviews)</p>
              </div>
            </div>
          </div>

          <p className="text-lg text-[#9a734c] leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {['100% Fresh', 'Daily Made', 'Top Rated'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-[#f3ede7] text-[#1b140d] text-xs font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-[#f3ede7] pt-8 space-y-8">
            {/* Size selection */}
            <div>
              <h3 className="text-sm font-black text-[#1b140d] uppercase tracking-widest mb-4">Select Size</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Regular', 'Large', 'Double'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setSize(s)}
                    className={`relative py-4 px-2 rounded-2xl border-2 transition-all text-sm font-bold uppercase ${
                      size === s ? 'border-[#ec8013] bg-[#ec8013]/5' : 'border-[#f3ede7] hover:border-[#ec8013]'
                    }`}
                  >
                    {s}
                    {s !== 'Regular' && <span className="block text-[10px] font-normal opacity-70 mt-1">+(+$2.00)</span>}
                    {size === s && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#ec8013] rounded-full flex items-center justify-center shadow-md">
                        <span className="material-icons-round text-white text-[12px]">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <h3 className="text-sm font-black text-[#1b140d] uppercase tracking-widest mb-4">Add-ons</h3>
              <div className="space-y-3">
                {[
                  { name: 'Extra Cheese', price: 1.5 },
                  { name: 'Bacon Strips', price: 2.0 },
                  { name: 'Avocado', price: 2.5 }
                ].map((addon) => (
                  <label 
                    key={addon.name}
                    className="flex items-center justify-between p-4 rounded-2xl border border-[#f3ede7] cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-[#9a734c] text-[#ec8013] focus:ring-[#ec8013]"
                        checked={selectedAddons.includes(addon.name)}
                        onChange={() => toggleAddon(addon.name)}
                      />
                      <span className="text-sm font-bold text-[#1b140d]">{addon.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#ec8013]">+${addon.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
              <div className="flex items-center border border-[#f3ede7] rounded-2xl h-14 bg-white shadow-sm overflow-hidden w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-5 hover:text-[#ec8013] transition-colors"
                >
                  <span className="material-icons-round">remove</span>
                </button>
                <span className="w-12 text-center font-bold text-[#1b140d]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-5 hover:text-[#ec8013] transition-colors"
                >
                  <span className="material-icons-round">add</span>
                </button>
              </div>
              <button 
                onClick={onCheckout}
                className="flex-1 w-full bg-[#ec8013] text-white rounded-2xl py-4 px-8 font-black text-lg shadow-xl shadow-[#ec8013]/30 transform active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-icons-round">shopping_bag</span>
                Add to Order • ${totalPrice.toFixed(2)}
              </button>
              <button className="h-14 w-14 shrink-0 bg-white border border-[#f3ede7] rounded-2xl flex items-center justify-center text-[#9a734c] hover:text-red-500 transition-all shadow-sm">
                <span className="material-icons-round">favorite_border</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-sell */}
      <section className="border-t border-[#f3ede7] pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#1b140d]">Goes well with</h2>
          <button className="text-sm font-bold text-[#ec8013] hover:underline flex items-center">
            See all <span className="material-icons-round text-sm ml-1">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ITEMS.filter(i => i.id !== item.id).map((subItem) => (
            <div key={subItem.id} className="bg-white rounded-3xl p-5 shadow-sm border border-[#f3ede7] hover:shadow-lg transition-all group">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <img alt={subItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={subItem.image} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1b140d] leading-tight">{subItem.name}</h3>
                  <p className="text-xs text-[#9a734c] mt-1">{subItem.category}</p>
                </div>
                <p className="text-sm font-black text-[#ec8013]">${subItem.price.toFixed(2)}</p>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-[#f3ede7] hover:bg-[#ec8013] hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2">
                <span className="material-icons-round text-base">add</span> Quick Add
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

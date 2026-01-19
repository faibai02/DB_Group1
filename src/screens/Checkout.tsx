
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';
import type { OrderItem } from '../api/orders';

interface CheckoutProps {
  onPlaceOrder?: () => void;
  onNavigateToPage?: (page: string, orderData?: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onPlaceOrder, onNavigateToPage }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [cityPostal, setCityPostal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePlaceOrder = async () => {
    if (!streetAddress.trim() || !cityPostal.trim()) {
      setOrderStatus({ type: 'error', message: 'Please enter complete address' });
      return;
    }

    if (cart.length === 0) {
      setOrderStatus({ type: 'error', message: 'Your cart is empty' });
      return;
    }

    setIsLoading(true);
    try {
      // Get the restaurant_id from the first item (assuming all items are from the same restaurant)
      const restaurantId = cart[0].item.restaurant_id || 1;
      
      // Format items for the API
      const items: OrderItem[] = cart.map(cartItem => ({
        dish_id: parseInt(cartItem.item.id),
        quantity: cartItem.quantity,
        unit_price: cartItem.item.price,
      }));

      const deliveryAddress = `${streetAddress}, ${cityPostal}`;
      const totalAmount = getTotalPrice();

      const response = await createOrder({
        restaurant_id: restaurantId,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        items,
      });

      // Prepare order data for confirmation page
      const orderData = {
        orderId: response.order_id,
        items: cart.map(cartItem => ({
          name: cartItem.item.name,
          quantity: cartItem.quantity,
          price: cartItem.item.price
        })),
        total: totalAmount,
        address: deliveryAddress
      };

      setOrderStatus({ type: 'success', message: 'Order placed successfully!' });
      clearCart();
      
      // Keep loading state and redirect to confirmation
      setTimeout(() => {
        if (onNavigateToPage) {
          onNavigateToPage('confirmation', orderData);
        } else if (onPlaceOrder) {
          onPlaceOrder();
        }
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setOrderStatus({ type: 'error', message: error.message || 'Failed to place order' });
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && orderStatus?.type === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <span className="material-icons-round text-6xl text-[#ec8013] animate-spin">autorenew</span>
            <p className="text-xl font-black text-[#1b140d]">Redirecting to confirmation...</p>
          </div>
        </div>
      )}
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Checkout</h1>
            <p className="text-[#9a734c] text-lg">Complete your order details below</p>
          </div>

          {/* Step 1: Delivery Details (Editable) */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] p-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="material-icons-round text-[#ec8013] text-2xl">location_on</span>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#1b140d] mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">Street Address & Number</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g., 123 Main Street"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-[#1b140d] uppercase tracking-widest">City & Postal Code</label>
                    <input
                      type="text"
                      value={cityPostal}
                      onChange={(e) => setCityPostal(e.target.value)}
                      placeholder="e.g., New York, NY 10001"
                      className="w-full px-4 py-3 bg-gray-50 border border-[#f3ede7] focus:border-[#ec8013] focus:ring-0 rounded-2xl text-[#1b140d] font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-6">
            {/* Map Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden h-44 relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://picsum.photos/seed/map/400/200")' }}></div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                <span className="material-icons-round text-[#ec8013] text-sm">schedule</span>
                25-35 min
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#f3ede7] space-y-6">
              <h3 className="text-xl font-black text-[#1b140d]">Order Summary</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-icons-round text-6xl text-gray-300 mb-2">shopping_cart</span>
                  <p className="text-[#9a734c] text-sm">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between items-start pb-4 border-b border-dashed border-gray-100">
                        <div className="flex gap-3 flex-1">
                          <span className="text-[#ec8013] font-black text-xs bg-[#ec8013]/10 px-2 py-1 rounded-md h-fit">{cartItem.quantity}x</span>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#1b140d]">{cartItem.item.name}</p>
                            <p className="text-xs text-[#9a734c] mt-1">${cartItem.item.price.toFixed(2)} each</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, Math.max(1, cartItem.quantity - 1))}
                                className="size-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                className="size-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(cartItem.item.id)}
                                className="ml-auto text-red-500 hover:text-red-600 text-xs font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="font-black text-sm text-[#1b140d]">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-[#1b140d]">Total</span>
                      <span className="text-3xl font-black text-[#ec8013]">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  {orderStatus && (
                    <div
                      className={`p-4 rounded-xl text-sm font-bold ${
                        orderStatus.type === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {orderStatus.message}
                    </div>
                  )}

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="w-full bg-[#ec8013] hover:bg-[#d67210] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-[#ec8013]/30 transition-all transform active:scale-95 flex items-center justify-between"
                  >
                    {isLoading ? (
                      <>
                        <span className="flex items-center gap-2">
                          <span className="material-icons-round animate-spin">autorenew</span>
                          Processing...
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${getTotalPrice().toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${getTotalPrice().toFixed(2)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-[#9a734c] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 pt-2">
                    <span className="material-icons-round text-sm">lock</span>
                    Secure Checkout
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;

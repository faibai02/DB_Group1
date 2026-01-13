
import React, { useState } from 'react';
import { Screen, FoodItem } from './src/types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './src/screens/Home';
import ProductDetail from './src/screens/ProductDetail';
import Checkout from './src/screens/Checkout';
import Tracking from './src/screens/Tracking';
import Confirmation from './src/screens/Confirmation';
import Profile from './src/screens/Profile';
import Orders from './src/screens/Orders';
import Favorites from './src/screens/Favorites';
import Restaurants from './src/screens/Restaurants';
import { MOCK_ITEMS } from './src/constants';
import { createOrder, OrderItem } from './src/api/orders';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<{ item: FoodItem; quantity: number }[]>([]);

  const navigateTo = (screen: Screen, item?: FoodItem) => {
    if (item) setSelectedItem(item);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleCheckout = (item: FoodItem, quantity: number = 1) => {
    setCart([{ item, quantity }]);
    navigateTo('checkout');
  };

  const handleSelectRestaurant = (restaurantId: number, name: string) => {
    // Navigate to home and filter by restaurant
    // For now, just go to home
    navigateTo('home');
  };

  const handlePlaceOrder = async () => {
    try {
      if (cart.length === 0) {
        console.error('Cart is empty');
        return;
      }

      const totalAmount = cart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
      
      const orderItems: OrderItem[] = cart.map(cartItem => ({
        dish_id: Number(cartItem.item.id),
        quantity: cartItem.quantity,
        unit_price: cartItem.item.price
      }));

      const orderData = {
        customer_id: 1, // TODO: Use real customer ID from auth
        restaurant_id: cart[0].item.restaurant_id || 1,
        total_amount: totalAmount,
        delivery_address: '123 Main Street, New York, NY 10001 • Apt 4B',
        items: orderItems
      };

      const response = await createOrder(orderData);
      console.log('Order created:', response);
      
      // Clear cart and navigate to confirmation
      setCart([]);
      navigateTo('confirmation');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onSelectProduct={(item) => navigateTo('detail', item)} />;
      case 'detail':
        return <ProductDetail item={selectedItem || MOCK_ITEMS[2]} onCheckout={() => selectedItem && handleCheckout(selectedItem)} />;
      case 'checkout':
        return <Checkout onPlaceOrder={handlePlaceOrder} />;
      case 'confirmation':
        return <Confirmation onTrackOrder={() => navigateTo('tracking')} onGoHistory={() => navigateTo('orders')} />;
      case 'tracking':
        return <Tracking />;
      case 'profile':
        return <Profile />;
      case 'orders':
        return <Orders />;
      case 'favorites':
        return <Favorites onSelectProduct={(item) => navigateTo('detail', item)} />;
      case 'restaurants':
        return <Restaurants onSelectRestaurant={handleSelectRestaurant} />;
      default:
        return <Home onSelectProduct={(item) => navigateTo('detail', item)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={navigateTo} 
        currentScreen={currentScreen} 
      />
      <main className="flex-grow">
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
};

export default App;

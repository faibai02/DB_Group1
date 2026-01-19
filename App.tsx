
import React, { useState } from 'react';
import { Screen, FoodItem } from './src/types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './src/screens/Home';
import ProductDetail from './src/screens/ProductDetail';
import Checkout from './src/screens/Checkout';
import Cart from './src/screens/Cart';
import Tracking from './src/screens/Tracking';
import Confirmation from './src/screens/Confirmation';
import Profile from './src/screens/Profile';
import Orders from './src/screens/Orders';
import Restaurants from './src/screens/Restaurants';
import RestaurantMenu from './src/screens/RestaurantMenu';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import { MOCK_ITEMS } from './src/constants';
import { createOrder, OrderItem } from './src/api/orders';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen | 'signup' | 'login' | 'cart'>('home');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{ id: number; name: string } | null>(null);
  const [lastOrder, setLastOrder] = useState<{orderId: number, items: any[], total: number, address: string} | null>(null);
  const { isLoggedIn, login, logout, isLoading } = useAuth();
  const { cart, clearCart } = useCart();

  const navigateTo = (screen: Screen | 'signup' | 'login' | 'cart', item?: FoodItem) => {
    if (item) setSelectedItem(item);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleCheckout = () => {
    navigateTo('checkout');
  };

  const handleSelectRestaurant = (restaurantId: number, name: string) => {
    setSelectedRestaurant({ id: restaurantId, name });
    navigateTo('menu');
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
      clearCart();
      navigateTo('confirmation');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signup':
        return <SignUp onSignUpSuccess={() => login({ email: '', name: '' })} onNavigate={navigateTo} />;
      case 'login':
        return <Login onLoginSuccess={() => {}} onNavigate={navigateTo} />;
      case 'home':
        return <Home onSelectProduct={(item) => navigateTo('detail', item)} />;
      case 'detail':
        return <ProductDetail item={selectedItem || MOCK_ITEMS[2]} onCheckout={() => navigateTo('cart')} onBack={() => navigateTo('home')} onNavigateLogin={() => navigateTo('login')} />;
      case 'cart':
        return <Cart onCheckout={handleCheckout} onContinueShopping={() => navigateTo('home')} onNavigateLogin={() => navigateTo('login')} />;
      case 'checkout':
        return <Checkout onPlaceOrder={handlePlaceOrder} onNavigateToPage={(page, orderData) => {
          if (page === 'confirmation' && orderData) {
            setLastOrder(orderData);
          }
          navigateTo(page as any);
        }} />;
      case 'confirmation':
        return <Confirmation orderData={lastOrder} onTrackOrder={() => navigateTo('tracking')} onGoHistory={() => navigateTo('orders')} />;
      case 'tracking':
        return <Tracking />;
      case 'profile':
        return <Profile />;
      case 'orders':
        return <Orders />;
      case 'restaurants':
        return <Restaurants onSelectRestaurant={handleSelectRestaurant} />;
      case 'menu':
        return selectedRestaurant ? (
          <RestaurantMenu 
            restaurantId={selectedRestaurant.id}
            restaurantName={selectedRestaurant.name}
            onBack={() => navigateTo('restaurants')}
            onSelectProduct={(item) => navigateTo('detail', item)}
          />
        ) : (
          <Restaurants onSelectRestaurant={handleSelectRestaurant} />
        );
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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <span className="material-icons-round text-6xl text-gray-400 animate-spin block mb-4">
                autorenew
              </span>
              <p className="text-[#9a734c] font-bold">Loading...</p>
            </div>
          </div>
        ) : (
          renderScreen()
        )}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

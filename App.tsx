
import React, { useState } from 'react';
import { Screen, FoodItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './screens/Home';
import ProductDetail from './screens/ProductDetail';
import Checkout from './screens/Checkout';
import Tracking from './screens/Tracking';
import Confirmation from './screens/Confirmation';
import Profile from './screens/Profile';
import Orders from './screens/Orders';
import Favorites from './screens/Favorites';
import { MOCK_ITEMS } from './constants';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const navigateTo = (screen: Screen, item?: FoodItem) => {
    if (item) setSelectedItem(item);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onSelectProduct={(item) => navigateTo('detail', item)} />;
      case 'detail':
        return <ProductDetail item={selectedItem || MOCK_ITEMS[2]} onCheckout={() => navigateTo('checkout')} />;
      case 'checkout':
        return <Checkout onPlaceOrder={() => navigateTo('confirmation')} />;
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

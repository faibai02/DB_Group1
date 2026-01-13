
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  restaurant?: string;
  restaurant_id?: number;
}

export interface OrderItem {
  item: FoodItem;
  quantity: number;
  options?: string[];
}

export interface Order {
  id: string;
  date: string;
  restaurant: string;
  items: number;
  total: number;
  status: 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
}

export type Screen = 'home' | 'detail' | 'checkout' | 'tracking' | 'confirmation' | 'profile' | 'orders' | 'favorites' | 'restaurants';

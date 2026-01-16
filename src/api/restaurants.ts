import { getJSON } from "./http";
import type { FoodItem } from "../types";

export interface RestaurantRow {
  restaurant_id: number;
  name: string;
  address?: string;
  phone?: string;
  opening_hour?: string;
  image: string;
}

export async function fetchRestaurants(): Promise<RestaurantRow[]> {
  return getJSON<RestaurantRow[]>("restaurant");
}

export async function fetchDishByRestaurant(restaurantId: number): Promise<FoodItem[]> {
  // Get all dishes and filter by restaurant on the client side
  const allDishes = await getJSON<FoodItem[]>("home");
  return allDishes.filter(dish => dish.restaurant_id === restaurantId);
}

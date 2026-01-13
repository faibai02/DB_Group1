import { getJSON } from "./http";
import type { FoodItem } from "../types";

type RestaurantRow = {
  restaurant_id: number;
  name: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
};

export async function fetchRestaurants(): Promise<RestaurantRow[]> {
  const sql = `
    SELECT DISTINCT
      r.restaurant_id,
      r.name,
      r.address,
      r.phone,
      r.opening_hours
    FROM restaurants r
  `;
  
  return getJSON<RestaurantRow[]>("restaurants.php");
}

export async function fetchDishByRestaurant(restaurantId: number): Promise<FoodItem[]> {
  const sql = `
    SELECT
      d.dish_id,
      d.name,
      d.description,
      d.price,
      d.category,
      r.name AS restaurant,
      r.restaurant_id
    FROM dishes d
    JOIN restaurants r ON r.restaurant_id = d.restaurant_id
    WHERE d.restaurant_id = ?
  `;
  
  return getJSON<FoodItem[]>(`dishes.php?restaurant_id=${restaurantId}`);
}

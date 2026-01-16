import { getJSON } from "./http";
import type { FoodItem } from "../types";

type DishRow = {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurant: string;
};

export async function fetchMenu(): Promise<FoodItem[]> {
  const rows = await getJSON<DishRow[]>("home");

  return rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    description: r.description ?? "",
    price: Number(r.price),
    image: r.image,
    category: r.category ?? "",
    restaurant: r.restaurant ?? "",
    restaurant_id: r.restaurant_id,
    rating: 4.6,
    reviews: 100,
  }));
}

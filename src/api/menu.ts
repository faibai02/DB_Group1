import { getJSON } from "./http";
import type { FoodItem } from "../types";

type DishRow = {
  dish_id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  restaurant: string;
  restaurant_id: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200";

export async function fetchMenu(): Promise<FoodItem[]> {
  const rows = await getJSON<DishRow[]>("api.php");

  return rows.map((r) => ({
    id: String(r.dish_id),
    name: r.name,
    description: r.description ?? "",
    price: Number(r.price),
    image: FALLBACK_IMAGE,     // your DB doesn't have image URLs yet
    category: r.category ?? "",
    restaurant: r.restaurant ?? "",
    restaurant_id: r.restaurant_id,
    rating: 4.6,               // optional placeholders
    reviews: 100,
  }));
}

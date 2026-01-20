import { getJSON } from "./http";
import type { FoodItem } from "../types";

export interface Category {
  category_id: number;
  name: string;
  description: string;
  image: string;
}

export async function fetchCategories(): Promise<Category[]> {
  return getJSON<Category[]>("categories");
}

export async function fetchDishesByCategory(categoryName: string): Promise<FoodItem[]> {
  const rows = await getJSON<any[]>(`dishes-by-category?category=${encodeURIComponent(categoryName)}`);

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

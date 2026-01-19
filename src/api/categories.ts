import { getJSON } from "./http";

export interface Category {
  category_id: number;
  name: string;
  description: string;
  image: string;
}

export async function fetchCategories(): Promise<Category[]> {
  return getJSON<Category[]>("categories");
}

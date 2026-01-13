const BASE_URL = "http://localhost/food_api";

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`);
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json() as Promise<T>;
}

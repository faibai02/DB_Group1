const BASE_URL = "http://localhost/api";

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`);
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function postJSON<T>(path: string, data: any): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json() as Promise<T>;
}

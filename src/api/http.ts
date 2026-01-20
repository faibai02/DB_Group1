const BASE_URL = "http://localhost:6969";

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    credentials: 'include', // Include cookies for authentication
  });
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function postJSON<T>(path: string, data: any): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMessage = `API failed: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Keep the default error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function putJSON<T>(path: string, data: any): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function deleteRequest(path: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
}

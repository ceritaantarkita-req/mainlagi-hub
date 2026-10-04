export async function shopRequest<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`/api/shop/${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error ?? "Permintaan gagal.");
  return data as T;
}

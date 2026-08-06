"use client";
import { getValidAccessToken, isSupabaseConfigured } from "./supabase-auth";

function config() { return { url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, ""), anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" }; }
async function request(path: string, init: RequestInit = {}) {
  if (!isSupabaseConfigured()) throw new Error("Supabase belum dikonfigurasi.");
  const { url, anon } = config(); const token = await getValidAccessToken(); if (!token) throw new Error("Login diperlukan.");
  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: anon, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers ?? {}) } });
  if (!response.ok) throw new Error(`Supabase REST ${response.status}: ${await response.text()}`);
  const text = await response.text(); return text ? JSON.parse(text) as unknown : null;
}
export interface AffiliateRecord { id?: string; slug: string; title: string; platform: string; category: string; image_url: string; destination_url: string; active: boolean; sort_order: number }
export async function listAffiliateItems(): Promise<AffiliateRecord[]> { return await request("affiliate_items?select=*&order=sort_order.asc") as AffiliateRecord[]; }
export async function createAffiliateItem(item: AffiliateRecord): Promise<AffiliateRecord> { const rows = await request("affiliate_items", { method: "POST", body: JSON.stringify(item) }) as AffiliateRecord[]; return rows[0]!; }
export async function updateAffiliateItem(id: string, item: Partial<AffiliateRecord>): Promise<void> { await request(`affiliate_items?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(item) }); }

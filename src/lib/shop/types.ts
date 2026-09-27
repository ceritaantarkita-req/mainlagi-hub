export type Product = {
  id: string;
  product_code: string;
  slug: string;
  title: string;
  description: string;
  category_slug: string;
  base_price_amount: number;
  status: string;
  review_status: "draft" | "ready_for_review" | "approved";
  facts: Record<string, unknown>;
  initial_stock_total: number;
  facts_verified: boolean;
  media_approved: boolean;
  updated_at?: string;
  shop_variants: Variant[];
  shop_product_media: {
    id?: string;
    path: string;
    alt_text: string;
    role?: "hero" | "in_use" | "in_use_alt";
    sort_order: number;
    approval_status: "review" | "approved" | "rejected";
  }[];
};
export type Variant = {
  id: string;
  sku: string;
  title: string;
  weight_grams: number | null;
  is_active: boolean;
  price_override_amount: number | null;
  option_values: Record<string, string>;
  length_mm?: number | null;
  width_mm?: number | null;
  height_mm?: number | null;
  shop_inventory_balances?:
    | { on_hand: number; reserved: number }
    | { on_hand: number; reserved: number }[]
    | null;
};
export type CartLine = {
  variant_id: string;
  quantity: number;
  shop_variants: Variant & { shop_products: Product };
};
export type Quote = {
  id: string;
  courier_code: string;
  service_code: string;
  service_name: string;
  duration_text: string | null;
  price_amount: number;
  destination_postal_code: string;
  expires_at: string;
};
export type Order = {
  id: string;
  order_number: string;
  account_id: string | null;
  guest_token_hash: string;
  customer: { name: string; phone: string; email: string };
  address_snapshot: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  shipping_quote_snapshot: Quote;
  subtotal_amount: number;
  shipping_amount: number;
  grand_total_amount: number;
  order_status: string;
  payment_status: string;
  fulfillment_status: string;
  expires_at: string;
  paid_at: string | null;
  created_at: string;
};
export type OrderItem = {
  title_snapshot: string;
  sku_snapshot: string;
  unit_price_amount: number;
  quantity: number;
  weight_grams_snapshot: number;
  line_total_amount: number;
};
export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
export const categories: Record<string, string> = {
  wear: "Pakai & bermain",
  daily: "Teman sehari-hari",
  "learn-create": "Belajar & berkarya",
};

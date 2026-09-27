import { OrderStatus } from "@/components/shop/OrderStatus";
export const metadata = { robots: { index: false, follow: false } };
export default async function OrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  return <OrderStatus number={(await params).number} />;
}

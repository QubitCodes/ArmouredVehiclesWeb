import OrderSummary from "@/components/orders/OrderSummary";

interface OrderSummaryPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSummaryPage({ params }: OrderSummaryPageProps) {
  const { id } = await params;
  return <OrderSummary orderId={id} />;
}


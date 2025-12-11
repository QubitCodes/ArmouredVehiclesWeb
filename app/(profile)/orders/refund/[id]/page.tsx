import RefundDetails from "@/components/orders/RefundDetails";

interface RefundPageProps {
  params: Promise<{ id: string }>;
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { id } = await params;
  return <RefundDetails orderId={id} />;
}


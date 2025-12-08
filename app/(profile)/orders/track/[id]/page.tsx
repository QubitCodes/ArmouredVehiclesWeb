import TrackOrder from "@/components/orders/TrackOrder";

interface TrackOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { id } = await params;
  return <TrackOrder orderId={id} />;
}


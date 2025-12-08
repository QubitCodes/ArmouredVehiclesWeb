import TrackingDetails from "@/components/orders/TrackingDetails";

interface TrackingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackingDetailsPage({ params }: TrackingDetailsPageProps) {
  const { id } = await params;
  return <TrackingDetails orderId={id} />;
}


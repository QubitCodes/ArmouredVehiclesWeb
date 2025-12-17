"use client";

import CreateWarrantyClaimPage from "@/components/warranty/CreateWarrantyClaimPage";
import { useParams } from "next/navigation";

export default function WarrantyClaimItemPage() {
  const params = useParams();
  const itemId = params.id as string;

  return <CreateWarrantyClaimPage itemId={itemId} />;
}


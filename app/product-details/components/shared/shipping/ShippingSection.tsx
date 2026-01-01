"use client";

import { useState } from "react";
import ShippingSummary from "./ShippingSummary";
import ShippingModal from "./ShippingModal";

export default function ShippingSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShippingSummary onChange={() => setOpen(true)} />
      <ShippingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

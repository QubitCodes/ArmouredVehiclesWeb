import AddressPage from "@/components/profile/AddressPage";
import { Suspense } from 'react';

export default function AddressPageRoute() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <AddressPage />
    </Suspense>
  );
}


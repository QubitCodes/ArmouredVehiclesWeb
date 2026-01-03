import { Suspense } from "react";
import { Package } from "lucide-react";
import SuccessClient from "./SuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <section className="bg-[#F0EBE3] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <Package className="w-16 h-16 text-[#D35400]" />
              </div>
              <p className="text-lg text-[#6E6E6E]">Preparing your success page...</p>
            </div>
          }
        >
          <SuccessClient />
        </Suspense>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Step5Page() {
  const router = useRouter();

  useEffect(() => {
      // Step 5 acts as "Application Under Review" or "Completed"
      // or redirects to dashboard if that's the intent.
      // For now, show a success message.
  }, []);

  return (
    <div className="max-w-[800px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black text-center">
        <h2 className="text-2xl font-bold font-orbitron mb-4">Application Submitted</h2>
        <p className="mb-6">Thank you for submitting your profile. Your application is currently under review.</p>
        
        <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#D35400] text-white font-bold uppercase clip-path-supplier"
        >
            Go to Home
        </button>
    </div>
  );
}

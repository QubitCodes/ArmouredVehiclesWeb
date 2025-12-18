"use client";

import { useRouter } from "next/navigation";

export default function SellerAddPhonePage() {
    const router = useRouter();

    const handleContinue = () => {
        router.push("/seller/verify-phone"); // ✅ next step
    };

    return (
        <section className="min-h-screen bg-[#EFE8DC] flex items-center justify-center px-4">
            {/* Card */}
            <div className="w-full max-w-lg bg-[#F4EFE6] p-10 shadow-md ">
                {/* Title */}
                <h1 className="text-xl font-orbitron font-bold uppercase text-black text-center">
                    Add Your Phone Number
                </h1>

                <p className="mt-2 text-sm text-gray-700">
                    We&apos;ll text a security code to your mobile phone to finish setting
                    up your account.
                </p>

                {/* Phone Input */}
                {/* Phone Input */}
                <div className="mt-6">
                    <div className="flex items-center h-[44px] border border-[#C7B88A] bg-[#EFE8DC]">
                        {/* Country flag + code */}
                        <div className="flex items-center gap-2 px-3 border-r border-[#C7B88A]">
                            <img
                                src="/icons/flags/uae.svg"
                                alt="UAE"
                                className="w-5 h-4 object-cover"
                            />
                            <span className="text-sm text-black">+971</span>
                        </div>

                        {/* Input */}
                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="Phone number"
                            className="flex-1 h-full bg-transparent px-3 text-sm
                 placeholder:text-gray-500
                 focus:outline-none"
                        />
                    </div>
                </div>


                {/* Info */}
                <p className="mt-3 text-xs text-gray-600">
                    By selecting Continue, you agree to receive a text message with a
                    security code. Standard rates may apply.
                </p>

                {/* Continue Button */}
                <div className="mt-8 items-center text-center">
                    <button
                        onClick={handleContinue}
                        className="w-[200px] h-[42px] bg-[#D35400] clip-path-supplier hover:bg-[#39482C] transition-colors"
                    >
                        <span className="flex items-center justify-center h-full w-full font-orbitron font-bold text-[12px] uppercase text-white leading-none">
                            Continue
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}

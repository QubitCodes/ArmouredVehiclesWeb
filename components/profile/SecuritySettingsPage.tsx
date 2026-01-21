"use client";

import { useState } from "react";
import DeleteAccountModal from "@/components/modal/DeleteAccountModal";

export default function SecuritySettingsPage() {
  const [password] = useState("••••••••••••");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Security Settings
        </h1>
      </div>

      {/* Security Section */}
      {/* <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-sm lg:text-base uppercase tracking-wide text-black mb-4">
          Security
        </h2>

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 md:max-w-[50%]">
            <label className="block font-inter text-sm text-[#666] mb-2">Password</label>
            <div className="w-full bg-[#F0EBE3] border border-[#C2B280] px-4 py-3">
              <span className="font-inter text-sm text-black tracking-wider">{password}</span>
            </div>
          </div>

          <div
            className="bg-[#C2B280] clip-path-supplier p-[1px] cursor-pointer inline-block"
          >
            <div className="bg-[#39482C] hover:bg-[#2d3a23] clip-path-supplier flex items-center justify-center px-6 h-[42px]">
              <span className="font-black text-[12px] font-orbitron uppercase text-white tracking-wide">
                Change Password
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Account Deletion Section */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6">
        <h2 className="font-orbitron font-black text-sm lg:text-base uppercase tracking-wide text-black mb-4">
          Account Deletion
        </h2>

        <button 
          onClick={() => setShowDeleteModal(true)}
          className="font-orbitron font-bold text-sm text-[#D35400] underline uppercase tracking-wide hover:text-[#B84700] transition-colors mb-2"
        >
          Delete Your Account
        </button>

        <p className="font-inter text-sm text-[#666]">
          We&apos;re sad to see you go — but we hope to welcome you back again!
        </p>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </main>
  );
}

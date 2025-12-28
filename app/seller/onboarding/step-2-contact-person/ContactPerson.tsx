"use client";

export default function ContactPerson({ onNext, onPrev }: any) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-orbitron font-bold text-black">
          AUTHORIZED CONTACT PERSON
        </h1>

        {/* Collapse icon (UI only) */}
        <span className="text-gray-500 cursor-pointer">⌃</span>
      </div>

      {/* FORM CARD */}
      <div className="border border-[#E2D6C3] p-6 bg-[#F0EBE3]">
        {/* FULL NAME */}
        <div className="mb-4">
          <label className="label">Full Name*</label>
          <input
            className="input"
            placeholder="Enter your full name"
          />
          <p className="text-xs text-gray-600 mt-1">
            Enter your complete name as it appears on your passport or ID.
          </p>
        </div>

        {/* JOB TITLE + EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="label">Job Title</label>
            <input
              className="input"
              placeholder="Type Your Job Title"
            />
          </div>

          <div>
            <label className="label">Work Email Address*</label>
            <input
              className="input"
              placeholder="Type Your Work Email Address"
            />
          </div>
        </div>

        {/* UPLOAD + MOBILE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPLOAD */}
          <div>
            <label className="label">
              Upload Passport Copy or Emirates ID*
            </label>

            <label
              className="mt-1 flex flex-col items-center justify-center
                         border border-dashed border-[#C7B88A]
                         bg-[#EFE8DC]
                         px-6 py-8
                         text-center
                         cursor-pointer
                         hover:bg-[#F0EBE3]"
            >
              {/* Upload icon */}
              <svg
                className="w-6 h-6 text-[#D35400] mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a4 4 0 010 8m-4-4v8m0 0l-3-3m3 3l3-3"
                />
              </svg>

              <p className="text-sm font-medium text-black mb-1">
                Choose a File or Drag & Drop It Here.
              </p>
              <p className="text-xs text-gray-600">
                JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
              </p>

              <input type="file" className="hidden" />
            </label>
          </div>

          {/* MOBILE */}
          <div>
            <label className="label">Mobile / WhatsApp Number*</label>
            <input
              className="input"
              placeholder="Type Your Mobile Number"
            />
          </div>
        </div>
      </div>

      {/* CONFIRMATION */}
      <div className="border border-[#E2D6C3] bg-[#F0EBE3] p-5 mt-6 py-8">
        <label className="flex items-start gap-3 text-sm text-black cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 w-[16px] h-[16px]
          border border-[#DDCFBC]
          bg-[#EBE3D6]
          accent-[#C7B88A]"
          />
          <span>
            I confirm the accuracy of the information provided and that I am
            authorized to act on behalf of this company.
          </span>
        </label>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center items-center mt-10 gap-6">
        {/* PREVIOUS */}
        <button
          onClick={onPrev}
          className="relative w-[280px] h-[42px] bg-transparent"
        >
          {/* Border shape */}
          <span
            className="absolute inset-0 clip-path-supplier bg-[#C7B88A]"
            aria-hidden
          />

          {/* Inner fill */}
          <span
            className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]"
            aria-hidden
          />

          {/* Text */}
          <span className="relative z-10 flex items-center justify-center h-full w-full
                   font-orbitron font-bold text-[13px] uppercase text-black">
            Previous
          </span>
        </button>



        {/* NEXT */}
        <button
          onClick={onNext}
          className="w-[280px] h-[42px]
               bg-[#D35400]
               font-orbitron font-bold
               text-[12px] uppercase
               text-white hover:bg-[#39482C] transition-colors
               clip-next clip-path-supplier"
        >
          NEXT
        </button>
      </div>

    </div>
  );
}

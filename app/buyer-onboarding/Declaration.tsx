"use client";


const selectedCountries = [
    {
        name: "United Arab Emirates (UAE)",
        code: "AE",
        flag: "/icons/flags/uae.svg",
    },
    {
        name: "Saudi Arabia (KSA)",
        code: "SA",
        flag: "/icons/flags/ksa.png",
    },
    {
        name: "Qatar",
        code: "QA",
        flag: "/icons/flags/qatar.png",
    },
    {
        name: "Oman",
        code: "OM",
        flag: "/icons/flags/oman.png",
    },
];

export default function Declaration({
    onNext,
    onPrev,
}: {
    onNext: () => void;
    onPrev: () => void;
}) {
    return (
        <div className="max-w-[1200px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black">
            {/* Title */}
            <h2
                className="text-[22px] font-bold uppercase mb-6"
                style={{ fontFamily: "Orbitron" }}
            >
                Compliance & End-Use Declaration
            </h2>
            <div className="bg-[#F0EBE3] py-2 px-5">


                {/* Purpose & End User */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

                    <div>
                        <label className="text-xs font-semibold mb-1 block">
                            Purpose of Procurement:
                        </label>
                        <select className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none">
                            <option>Internal Use</option>
                            <option>Resale</option>
                            <option>Government Contract</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">
                            End-User Type:
                        </label>
                        <select className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none">
                            <option>Military</option>
                            <option>Law Enforcement</option>
                            <option>Commercial</option>
                            <option>Civilian</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-[#F0EBE3] py-2 px-5 mt-4">
                {/* Countries of Use */}
                <div className="mb-8">
                    <label className="text-xs font-semibold mb-2 block">
                        Countries of Use / Export:
                    </label>

                    {/* Selected Countries */}
                    <div className="border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-3 pb-10">
                        {selectedCountries.map((c) => (
                            <span
                                key={c.code}
                                className="flex items-center gap-2 px-3 py-1
                 border border-[#C7B88A] bg-[#F0EBE3]
                 text-xs text-black"
                            >
                                {/* Flag */}
                                <img
                                    src={c.flag}
                                    alt={c.name}
                                    className="w-5 h-3 object-cover rounded-[2px]"
                                />

                                {/* Country Name */}
                                <span>{c.name}</span>

                                {/* Remove */}
                                <span className="ml-1 cursor-pointer text-sm leading-none">×</span>
                            </span>
                        ))} 
                        {/* add a search box and get the country inside country list */}
                        {/* Search box */}
                       
                      
                    </div>  <input
                            type="text"
                            value="In"
                            readOnly
                            className="
        flex-1 min-w-[120px]
        bg-transparent
        outline-none
        text-sm
        text-[#8A8A8A]
        placeholder-[#8A8A8A] pb-6
      "
                        />


                    {/* Country List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {["India", "Indonesia", "Iran", "Iraq", "Ireland"].map((country) => (
                            <label
                                key={country}
                                className="flex items-center gap-2 cursor-pointer text-black"
                            >
                                <input
                                    type="checkbox"
                                    className="
          w-[16px] h-[16px]
          border border-[#DDCFBC]
          bg-[#EBE3D6]
          accent-[#C7B88A]
        "
                                    defaultChecked={country === "India"}
                                />
                                {country}
                            </label>
                        ))}
                    </div>

                </div>

            </div>
            <div className="bg-[#F0EBE3] py-2 px-5 mt-4">
                <div className="mb-8">
                    <label className="text-xs font-semibold mb-3 block ">
                        Do you require controlled items? (Ballistic, Electronic, etc.)
                    </label>

                    <div className="flex gap-8 text-sm">

                        {/* YES */}
                        <label className="flex items-center gap-2 cursor-pointer relative group">
                            <input
                                type="radio"
                                name="controlled"
                                className="absolute opacity-0 w-4 h-4 cursor-pointer"
                            />

                            {/* Custom radio */}
                            <span
                                className="w-[16px] h-[16px] rounded-full
                     border border-[#C7B88A]
                     bg-[#EBE3D6]
                     flex items-center justify-center
                     group-has-[:checked]:bg-[#EBE3D6]"
                            >
                                <span
                                    className="w-[8px] h-[8px] rounded-full bg-[#C7B88A]
                       hidden group-has-[:checked]:block"
                                />
                            </span>

                            <span>Yes</span>
                        </label>

                        {/* NO */}
                        <label className="flex items-center gap-2 cursor-pointer relative group">
                            <input
                                type="radio"
                                name="controlled"
                                defaultChecked
                                className="absolute opacity-0 w-4 h-4 cursor-pointer"
                            />

                            <span
                                className="w-[16px] h-[16px] rounded-full
                     border border-[#C7B88A]
                     bg-[#EBE3D6]
                     flex items-center justify-center"
                            >
                                <span
                                    className="w-[8px] h-[8px] rounded-full bg-[#C7B88A]
                       hidden group-has-[:checked]:block"
                                />
                            </span>

                            <span>No</span>
                        </label>

                    </div>
                </div>
            </div>


            <div className="bg-[#F0EBE3] py-2 px-5 mt-4">
                <div className="p-4">
                    <h4 className="text-sm font-semibold mb-2">
                        Agree to Compliance Terms
                    </h4>

                    <label className="flex items-start gap-3 text-xs text-[#2B2B2B] cursor-pointer">

                        {/* ✅ Native checkbox (WORKING) */}
                        <input
                            type="checkbox"
                            className="
          mt-[2px]
          w-[16px] h-[16px]
          border border-[#C7B88A]
          bg-[#EBE3D6]
          accent-[#C7B88A]
        "
                        />

                        {/* Text */}
                        <span className="leading-relaxed">
                            I acknowledge that all transactions are subject to UAE and international
                            laws and may be screened, paused, or reported in accordance with
                            ArmoredMart’s regulatory obligations.
                        </span>

                    </label>
                </div>
            </div>




            <div className="flex justify-center gap-6 mt-10">
                <button
                    onClick={onPrev}
                    className="relative w-[220px] h-[48px] bg-transparent"
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

                <button
                    onClick={onNext}
                    className="w-[280px] h-[48px] bg-[#D35400] text-white font-black
                     clip-path-supplier uppercase hover:bg-[#39482C] transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

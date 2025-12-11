interface ClipPathButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function ClipPathButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  fullWidth = false,
}: ClipPathButtonProps) {
  const baseClasses = "clip-path-supplier transition-colors";
  
  const variantClasses = {
    primary: "bg-[#3D4A26] hover:bg-[#4A5D3A] text-white",
    secondary: "bg-[#EBE3D6] hover:bg-[#3D4A26] text-[#000] hover:text-white",
    outline: "bg-[#F5F0E6] hover:bg-[#EBE6DC] text-[#333333]",
  };

  const wrapperClasses = {
    primary: "bg-[#3D4A26]",
    secondary: "bg-[#3D4A26]",
    outline: "bg-[#C2B280]",
  };

  return (
    <div className={`relative clip-path-supplier ${wrapperClasses[variant]} p-[1px] ${fullWidth ? "w-full" : ""}`}>
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} px-6 py-2 text-sm font-bold font-orbitron uppercase tracking-wide ${fullWidth ? "w-full" : ""} ${className}`}
      >
        {children}
      </button>
    </div>
  );
}


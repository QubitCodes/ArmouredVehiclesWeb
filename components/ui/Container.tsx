interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={`max-w-[1400px] mx-auto px-4 ${className || ''}`}>
      {children}
    </div>
  );
};
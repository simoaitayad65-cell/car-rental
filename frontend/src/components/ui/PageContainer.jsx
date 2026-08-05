export default function PageContainer({ narrow = false, className = "", children }) {
  return (
    <div className={`mx-auto w-full ${narrow ? "max-w-md" : "max-w-5xl"} px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}

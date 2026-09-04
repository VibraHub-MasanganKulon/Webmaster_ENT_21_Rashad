// app/(public)/layout.tsx
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      
      {/* Main content area */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <PublicFooter />
    </div>
  );
}
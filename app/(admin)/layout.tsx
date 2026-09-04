// app/(admin)/layout.tsx
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Gunakan min-h-screen dan flex-col agar footer selalu di bawah
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Header Sticky di paling atas (Full Width) */}
      <AdminHeader />

      {/* Area Bawah Header: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Fixed width, scrollable sendiri jika menu panjang */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white hidden md:block">
          <Sidebar />
        </aside>

        {/* Main Content Area: Scrollable independen */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
          
          {/* Footer diletakkan DI DALAM main agar ikut ter-scroll atau tetap di bawah konten */}
          <div className="mt-12 pt-6 border-t border-slate-200">
            <AdminFooter />
          </div>
        </main>

      </div>
    </div>
  );
}
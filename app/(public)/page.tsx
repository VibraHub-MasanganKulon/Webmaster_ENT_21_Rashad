// app/(public)/page.tsx
import NewsGrid from "@/components/public/NewsGrid";
import Sidebar from "@/components/public/Sidebar";

export default function HomePage() {
  return (
    // Container utama dengan max-width agar rapi di layar besar
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Konten Berita Utama (Lebar 8/12) */}
        <div className="lg:col-span-8 space-y-12">
          <NewsGrid />
        </div>
        
        {/* Kolom Kanan: Sidebar Widget (Lebar 4/12) */}
        <aside className="lg:col-span-4 space-y-8">
          <Sidebar />
        </aside>

      </div>
    </div>
  );
}
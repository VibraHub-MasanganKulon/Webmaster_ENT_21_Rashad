// components/public/NewsGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts } from '@/services/post.service';

export default async function NewsGrid() {
  // Ambil 3 berita terbaru. Jika DB kosong, fallback ke array kosong []
  const latestPosts = await getLatestPosts(3).catch(() => []);

  // Dummy data tetap dipertahankan sesuai permintaan sebelumnya
  const featuredNews = {
    id: 999,
    title: 'Luncurkan Mobil Listrik Pintar Terbaru Generasi Ke-3',
    excerpt: 'Perusahaan otomotif ternama meluncurkan mobil listrik dengan teknologi otonom terbaru.',
    category: 'Teknologi',
    author: 'Redaksi',
    publishedAt: '2026-09-04',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    views: 1240,
  };

  const secondaryNews = [
    {
      id: 4,
      title: 'Teknologi AI Terbaru Membantu Diagnosis Penyakit',
      excerpt: 'Peneliti mengembangkan sistem AI yang mampu mendeteksi penyakit langka.',
      category: 'Kesehatan',
      author: 'Tim Kesehatan',
      publishedAt: '2026-09-01',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
      views: 567,
    },
    {
      id: 5,
      title: 'Festival Budaya Nusantara 2026 Dimulai Hari Ini',
      excerpt: 'Ribuan seniman dari berbagai daerah berkumpul dalam festival budaya.',
      category: 'Hiburan',
      author: 'Redaksi',
      publishedAt: '2026-08-31',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      views: 923,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Featured News - Large (Static/Dummy) */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900">Berita Utama</h2>
        </div>
        
        <Link href={`/berita/${featuredNews.id}`} className="group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="relative h-64 lg:h-96 overflow-hidden bg-slate-100">
              <Image
                src={featuredNews.imageUrl}
                alt={featuredNews.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                  {featuredNews.category}
                </span>
              </div>
            </div>
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                {featuredNews.title}
              </h2>
              <p className="text-slate-600 mb-6 line-clamp-3 text-lg">
                {featuredNews.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {(featuredNews.author || 'R').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{featuredNews.author}</p>
                    <p className="text-xs">{new Date(featuredNews.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {featuredNews.views.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Secondary News - Grid 3 (DARI DATABASE - NULL SAFE) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Berita Terbaru</h2>
          </div>
          <Link href="/semua-berita" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
            Lihat Semua
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {latestPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada berita terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((news) => (
              <Link key={news.id} href={`/berita/${news.slug}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {/* NULL CHECK: Gambar */}
                    {news.featuredImage? (
                      <Image
                        src="./../../../public/images/placeholder/no-image.svg"
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    
                    {/* NULL CHECK: Kategori */}
                    {news.category?.name && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                          {news.category.name }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </h4>
                    
                    {/* NULL CHECK: Caption vs ContentText */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {news.caption}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                      {/* NULL CHECK: Tanggal Published vs Created */}
                      <span>
                        {new Date(news.publishedAt || news.createdAt).toLocaleDateString('id-ID')}
                      </span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {/* {news.view_count} */}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Tertiary News - List Style (Static/Dummy) */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900">Berita Lainnya</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryNews.map((news) => (
            <Link key={news.id} href={`/berita/${news.id}`} className="group">
              <article className="flex gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100">
                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {news.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{new Date(news.publishedAt).toLocaleDateString('id-ID')}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {news.views}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
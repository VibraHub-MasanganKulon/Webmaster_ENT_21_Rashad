import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  views: number;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Luncurkan Mobil Listrik Pintar Terbaru Generasi Ke-3',
    excerpt: 'Perusahaan otomotif ternama meluncurkan mobil listrik dengan teknologi otonom terbaru.',
    category: 'Teknologi',
    author: 'Redaksi',
    publishedAt: '2026-09-04',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    views: 1240,
  },
  {
    id: 2,
    title: 'Pertumbuhan Ekonomi Digital Indonesia Capai Rekor Tertinggi',
    excerpt: 'Ekonomi digital Indonesia tumbuh signifikan di tahun 2026.',
    category: 'Bisnis',
    author: 'Tim Bisnis',
    publishedAt: '2026-09-03',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    views: 856,
  },
  {
    id: 3,
    title: 'Timnas Indonesia Lolos ke Piala Dunia 2026',
    excerpt: 'Sejarah tercipta! Timnas Indonesia berhasil lolos ke Piala Dunia.',
    category: 'Olahraga',
    author: 'Redaksi Olahraga',
    publishedAt: '2026-09-02',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    views: 3420,
  },
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
  {
    id: 6,
    title: 'Harga Emas Dunia Kembali Naik',
    excerpt: 'Harga emas mencapai level tertinggi dalam 6 bulan terakhir.',
    category: 'Bisnis',
    author: 'Tim Ekonomi',
    publishedAt: '2026-08-30',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800',
    views: 1105,
  },
];

export default function NewsGrid() {
  const featuredNews = newsData[0];
  const regularNews = newsData.slice(1, 4);
  const secondaryNews = newsData.slice(4);

  return (
    <div className="space-y-12">
      {/* Featured News - Large */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900">Berita Utama</h2>
        </div>
        
        <Link href={`/berita/${featuredNews.id}`} className="group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="relative h-64 lg:h-96 overflow-hidden">
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
                    {featuredNews.author.charAt(0)}
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

      {/* Secondary News - Grid 3 */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((news) => (
            <Link key={news.id} href={`/berita/${news.id}`} className="group">
              <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                    <span>{new Date(news.publishedAt).toLocaleDateString('id-ID')}</span>
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

      {/* Tertiary News - List Style */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900">Berita Lainnya</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryNews.map((news) => (
            <Link key={news.id} href={`/berita/${news.id}`} className="group">
              <article className="flex gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
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
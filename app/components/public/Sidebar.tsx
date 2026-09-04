import Link from 'next/link';
import Image from 'next/image';

const popularPosts = [
  {
    id: 1,
    title: 'Indonesia Lolos Piala Dunia 2026',
    category: 'Olahraga',
    views: '12.5K',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
  },
  {
    id: 2,
    title: 'Teknologi AI Terbaru untuk Kesehatan',
    category: 'Teknologi',
    views: '8.3K',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400',
  },
  {
    id: 3,
    title: 'Ekonomi Digital Tumbuh 15%',
    category: 'Bisnis',
    views: '6.7K',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
  },
  {
    id: 4,
    title: 'Festival Budaya Nusantara 2026',
    category: 'Hiburan',
    views: '5.2K',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
  },
];

const categories = [
  { name: 'Nasional', count: 245, href: '/nasional' },
  { name: 'Internasional', count: 189, href: '/internasional' },
  { name: 'Teknologi', count: 156, href: '/teknologi' },
  { name: 'Bisnis', count: 134, href: '/bisnis' },
  { name: 'Olahraga', count: 198, href: '/olahraga' },
  { name: 'Hiburan', count: 167, href: '/hiburan' },
  { name: 'Kesehatan', count: 112, href: '/kesehatan' },
  { name: 'Lifestyle', count: 143, href: '/lifestyle' },
];

const tags = [
  'Piala Dunia', 'Teknologi', 'Ekonomi', 'Kesehatan', 
  'Bisnis', 'Startup', 'AI', 'Cryptocurrency', 
  'Sepak Bola', 'Musik', 'Film', 'Travel'
];

export default function Sidebar() {
  return (
    <aside className="space-y-8">
      {/* Newsletter */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Newsletter</h3>
        <p className="text-blue-100 text-sm mb-4">Dapatkan berita terbaru langsung di email Anda</p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Populer Minggu Ini
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <Link key={post.id} href={`/berita/${post.id}`} className="flex gap-3 group">
              <span className="text-2xl font-bold text-slate-200 group-hover:text-blue-600 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.views}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Kategori</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 group transition-colors"
            >
              <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Tag Populer</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(' ', '-')}`}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-lg transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-3">
          <a href="#" className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-semibold">Facebook</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="text-sm font-semibold">Twitter</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span className="text-sm font-semibold">Instagram</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-sm font-semibold">YouTube</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
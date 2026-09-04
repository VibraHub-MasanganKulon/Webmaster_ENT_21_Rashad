// app/(public)/berita/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/services/post.service';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let post = null;
  
  // Bungkus fetching data dengan try-catch agar tidak white screen total
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error("CRITICAL ERROR fetching post:", error);
    return <div className="p-10 text-red-500">Gagal memuat data dari database.</div>;
  }

  if (!post) {
    notFound(); 
  }

  // Fallback values yang sangat aman
  const safeDate = post.publishedAt || post.createdAt ? new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia';
  const authorName = post.author?.name || 'Redaksi';
  const category = post.category?.name || 'Umum';
  
  // Pastikan contentText tidak undefined
  const content = post.contentText || 'Konten berita kosong.';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <Link
            href="/"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
      </Link>
      <header className="mb-8">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{category}</span>
        <h1 className="text-3xl text-black font-bold mt-3 mb-2">{post.title}</h1>
        <div className="text-sm text-slate-800 flex gap-2">
          <span>{authorName}</span>
          <span>•</span>
          <span>{safeDate}</span>
        </div>
      </header>

      {/* Gambar Utama - Gunakan div placeholder jika url null */}
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl overflow-hidden mb-8 relative">
        <Image 
            src="./../../../../public/images/placeholder/no-image.svg" 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
      </div>

      {/* Konten */}
      <article className="prose max-w-none whitespace-pre-wrap text-black">
        {content}
      </article>
    </div>
  );
}
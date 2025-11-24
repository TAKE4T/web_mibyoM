"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  const pathname = usePathname() || '';
  const isPost = pathname.startsWith('/posts/');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[900px] px-4 py-12 text-center">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {isPost ? '記事準備中' : 'ページが見つかりません'}
          </h1>

          {isPost ? (
            <>
              <p className="text-gray-700">このページは現在準備中です。公開までしばらくお待ちください。</p>
              <div className="mt-6 space-x-3">
                <Link href="/" className="inline-block rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">トップへ戻る</Link>
                <Link href="/posts" className="inline-block rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-red-600 hover:text-red-600">記事一覧へ</Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">URLが正しいかご確認ください。見つからない場合はトップページから探してください。</p>
              <div className="mt-6">
                <Link href="/" className="inline-block rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">トップへ戻る</Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

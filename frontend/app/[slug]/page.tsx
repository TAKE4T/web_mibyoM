import { getPageBySlug, getPages } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 60;

// 動的パラメータの型定義
type Params = Promise<{ slug: string }>;

// 固定ページ
export default async function StaticPage({ params }: { params: Params }) {
  const { slug } = await params;

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[900px] px-4 py-8">
        {/* ページヘッダー */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {page.title}
          </h1>
        </header>

        {/* アイキャッチ画像 */}
        {page.featuredImage && (
          <div className="mb-8">
            <Image
              src={page.featuredImage.node.sourceUrl}
              alt={page.featuredImage.node.altText || page.title}
              className="w-full rounded-lg"
              width={page.featuredImage.node.mediaDetails.width}
              height={page.featuredImage.node.mediaDetails.height}
            />
          </div>
        )}

        {/* ページコンテンツ */}
        <article
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700
            prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:pl-4 prose-blockquote:italic
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* 更新日時 */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <p>公開日: {new Date(page.date).toLocaleDateString('ja-JP')}</p>
          {page.modified !== page.date && (
            <p>更新日: {new Date(page.modified).toLocaleDateString('ja-JP')}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// 静的パス生成（オプション: ビルド時に全固定ページを生成）
export async function generateStaticParams() {
  const pages = await getPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

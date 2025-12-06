// notFound is intentionally not used: show "記事準備中" inside article pages
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getPosts, getPopularPosts } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60; // ISR: 60秒ごとに再生成

// 静的パス生成
export async function generateStaticParams() {
  const { posts } = await getPosts({ perPage: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// パラメータの型定義
type PageParams = Promise<{ slug: string }>;

// メタデータ生成
export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: '記事準備中' };
  }

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function PostPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    // If a post isn't found, show an inline "記事準備中" UI rather than redirecting
    // to the global 404. This preserves the page frame and provides a clearer message.
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1200px] px-4 py-6">
          <article className="lg:col-span-9">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">記事準備中</h1>
              <p className="text-gray-700">このページは現在準備中です。公開までしばらくお待ちください。</p>
              <div className="mt-4">
                <Link href="/" className="text-red-600 hover:text-red-700">トップへ戻る</Link>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    );
  }

  // 関連記事（人気記事）
  const relatedPosts = await getPopularPosts(3);

  // GraphQL形式のデータから取得
  const imageUrl = post.featuredImage?.node?.sourceUrl || '/placeholder-image.jpg';
  const categories = post.categories?.nodes || [];
  const mainCategory = categories[0];

  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* メインコンテンツエリア */}
          <article className="lg:col-span-9">
            {/* パンくずリスト */}
            <nav className="mb-4 text-xs text-gray-500">
              <Link href="/" className="hover:text-red-600">ホーム</Link>
              {mainCategory && (
                <>
                  <span className="mx-2">›</span>
                  <Link href={`/category/${mainCategory.slug}`} className="hover:text-red-600">
                    {mainCategory.name}
                  </Link>
                </>
              )}
              <span className="mx-2">›</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>

            {/* カテゴリーバッジ */}
            {mainCategory && (
              <span className="inline-block mb-3 rounded bg-red-600 px-3 py-1 text-xs font-bold text-white">
                {mainCategory.name}
              </span>
            )}

            {/* タイトル */}
            <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
              {post.title}
            </h1>

            {/* 公開日 */}
            <time className="mb-6 block text-sm text-gray-500">{formattedDate}</time>

            {/* アイキャッチ画像 */}
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded">
              <Image
                src={imageUrl}
                alt={post.featuredImage?.node?.altText || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority
                className="object-cover"
              />
            </div>

            {/* 記事本文 */}
            <div
              className="prose prose-lg max-w-none wp-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* タグ */}
            {post.tags?.nodes && post.tags.nodes.length > 0 && (
              <div className="my-6 flex flex-wrap gap-2">
                {post.tags.nodes.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors"
                  >
                    <span className="text-xs">#</span>
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* メルマガ CTA は一時的に非表示 */}

            {/* 関連記事 */}
            {relatedPosts.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 border-b-2 border-red-600 pb-2 text-lg font-bold text-gray-900">
                  関連記事
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <ArticleCard key={relatedPost.databaseId} post={relatedPost} layout="small" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* サイドバー */}
          <aside className="lg:col-span-3">
            {/* 同じカテゴリーの記事や広告など */}
              <div className="border border-gray-200 bg-gray-100 p-4">
              <div className="aspect-[300/250] flex items-center justify-center bg-white text-gray-400 text-sm">
                {/* 広告枠（非表示） */}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

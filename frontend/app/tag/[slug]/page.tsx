import { getPosts, getTags } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;

// 動的パラメータの型定義
type Params = Promise<{ slug: string }>;

// タグページ
export default async function TagPage({ params }: { params: Params }) {
  const { slug } = await params;

  // 全タグを取得してslugでフィルター
  const tags = await getTags();
  const tag = tags.find(t => t.slug === slug);

  if (!tag) {
    notFound();
  }

  // タグ名で記事を検索（簡易版）
  // WordPressのGraphQLではタグスラッグで直接フィルタリングできないため、
  // 全記事を取得してクライアント側でフィルタリング
  const { posts: allPosts } = await getPosts({ perPage: 100 });
  const posts = allPosts.filter(post =>
    post.tags?.nodes.some(t => t.slug === slug)
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        {/* タグヘッダー */}
        <div className="mb-6 border-b-2 border-red-600 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">#</span>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {tag.name}
            </h1>
          </div>
          {tag.description && (
            <p className="mt-2 text-sm text-gray-600">{tag.description}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {posts.length}件の記事
          </p>
        </div>

        {/* 記事が見つからない場合 */}
        {posts.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-700">このタグには記事がありません。</p>
          </div>
        )}

        {/* 記事一覧 */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} layout="medium" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// 静的パス生成（オプション: ビルド時に全タグページを生成）
export async function generateStaticParams() {
  const tags = await getTags();

  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

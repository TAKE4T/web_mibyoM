import { getPosts, getCategories } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;

// 動的パラメータの型定義
type Params = Promise<{ slug: string }>;

// カテゴリーページ
export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;

  // 全カテゴリーを取得してslugでフィルター
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  // カテゴリーIDで記事をフィルター
  const { posts, total } = await getPosts({
    perPage: 30,
    categories: [category.databaseId],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        {/* カテゴリーヘッダー */}
        <div className="mb-6 border-b-2 border-red-600 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-sm text-gray-600">{category.description}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {total}件の記事
          </p>
        </div>

        {/* 記事が見つからない場合 */}
        {posts.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-700">このカテゴリーには記事がありません。</p>
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

// 静的パス生成（オプション: ビルド時に全カテゴリーページを生成）
export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

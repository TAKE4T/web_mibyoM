import { getPosts } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Suspense } from 'react';

export const revalidate = 60;

// 検索パラメータの型定義
type SearchParams = Promise<{ q?: string }>;

// 検索結果コンポーネント
async function SearchResults({ query }: { query: string }) {
  const { posts, total } = await getPosts({
    perPage: 30,
    search: query,
  });

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <div className="mb-4 text-4xl text-gray-400">🔍</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          検索結果が見つかりませんでした
        </h2>
        <p className="text-gray-600">
          「{query}」に一致する記事はありません。
        </p>
        <p className="mt-4 text-sm text-gray-500">
          別のキーワードで検索してみてください。
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          「<span className="font-bold text-gray-900">{query}</span>」の検索結果: {total}件
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} layout="medium" />
        ))}
      </div>
    </>
  );
}

// ローディング表示
function SearchLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-gray-200 p-4">
            <div className="h-40 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 検索ページ
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q: query } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {/* ページヘッダー */}
        <div className="mb-8 border-b-2 border-red-600 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            記事検索
          </h1>
        </div>

        {query ? (
          <Suspense fallback={<SearchLoading />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <div className="mb-4 text-4xl text-gray-400">🔍</div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              検索キーワードを入力してください
            </h2>
            <p className="text-gray-600">
              ヘッダーの検索バーからキーワードを入力して記事を検索できます。
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
